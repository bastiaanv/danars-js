import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { Subject, filter } from 'rxjs';
import { DanaRSEncryption } from './encryption';
import { DANA_PACKET_TYPE } from './models/dana.type.message.enum';
import { ENCRYPTION_TYPE } from './encryption/encryption.type.enum';
import { ObjectValues } from './types';
import { ConnectionEvents } from './events/connection.events';

type ConnectingEvents = { code: ObjectValues<typeof ConnectionEvents>; message?: string | undefined };
const deviceNameRegex = new RegExp(/^([a-zA-Z]{3})([0-9]{5})([a-zA-Z]{2})$/);
export class BleComm {
  // Event emitters
  private readonly connectingSubject = new Subject<ConnectingEvents>();
  // Constants
  private readonly PACKET_START_BYTE = 0xa5;
  private readonly PACKET_END_BYTE = 0x5a;
  private readonly ENCRYPTED_START_BYTE = 0xaa;
  private readonly ENCRYPTED_END_BYTE = 0xee;

  private READ_SERVICE_UUID = '';
  private readonly READ_CHAR_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
  // private readonly BLE5_DESCRIPTOR_UUID = '00002902-0000-1000-8000-00805f9b34fb';

  private WRITE_SERVICE_UUID = '';
  private readonly WRITE_CHAR_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

  // Device specific fields
  private deviceName = '';
  private deviceAddress = '';

  // NOTE: usage of `isEasyMode` and `isUnitUD` is unknown
  private isEasyMode = false;
  private isUnitUD = false;

  private _encryptionType: ObjectValues<typeof ENCRYPTION_TYPE> = ENCRYPTION_TYPE.DEFAULT;

  private set encryptionType(value: typeof this._encryptionType) {
    this._encryptionType = value;
    DanaRSEncryption.setEnhancedEncryption(value);
  }

  private get encryptionType() {
    return this._encryptionType;
  }

  // Buffers
  private readBuffer: Uint8Array = new Uint8Array(0);

  public async init(): Promise<void> {
    console.log(formatPrefix() + 'Initializing BLE');
    if ((await BluetoothLE.isInitialized()).isInitialized) {
      console.log(`${formatPrefix()} BLE was already initialized`);
      return;
    }

    await new Promise<void>((resolve, reject) =>
      BluetoothLE.initialize({ request: true, restoreKey: 'DiaKit' }).subscribe({
        next: ({ status }) => {
          if (status !== 'enabled') {
            console.error(`${formatPrefix('ERROR')} BluetoothLE not initialized...`);
            reject('BluetoothLE not initialized...');
            return;
          }

          console.log(`${formatPrefix()} BLE is initialized`);
          resolve();
        },
        error: (e) => {
          console.error(`${formatPrefix('ERROR')} Failed to initialize BLE`, e);
          reject(e);
        },
      })
    );

    if (!(await BluetoothLE.isEnabled()).isEnabled) {
      throw new Error('Bluetooth is disabled');
    }

    if (Capacitor.getPlatform() === 'android' && !(await BluetoothLE.hasPermission()).hasPermission) {
      if (!(await BluetoothLE.requestPermission()).requestPermission) {
        throw new Error('Missing permissions...');
      }
    }
  }

  public startScan() {
    return BluetoothLE.startScan({ isConnectable: true }).pipe(filter((x) => x.status === 'scanResult' && !!x.name && deviceNameRegex.test(x.name)));
  }

  public stopScan() {
    return BluetoothLE.stopScan();
  }

  public async connect(address: string) {
    if ((await BluetoothLE.isConnected({ address })).isConnected) {
      console.warn(`${formatPrefix('WARNING')} Already connected to device: ${address}`);
      return;
    }

    this.encryptionType = ENCRYPTION_TYPE.DEFAULT;

    BluetoothLE.connect({ address, autoConnect: true }).subscribe({
      next: async (connectInfo) => {
        if (connectInfo.status !== 'connected') {
          console.log(`${formatPrefix('WARNING')} Device status for ${connectInfo.name} changed to ${connectInfo.status}`);
          return;
        }

        if (!connectInfo.name) {
          await BluetoothLE.disconnect({ address });

          console.error(`${formatPrefix('ERROR')} Empty device name received...`, connectInfo);
          this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: 'Empty device name received...' });
          return;
        }

        this.deviceAddress = connectInfo.address;
        this.deviceName = connectInfo.name;

        this.connectingSubject.next({ code: ConnectionEvents.DeviceFound });
        try {
          const device = await BluetoothLE.discover({ address, clearCache: true });
          const writeService = device.services.find((x) => x.characteristics.some((y) => y.uuid === this.WRITE_CHAR_UUID));
          if (!writeService) {
            await BluetoothLE.disconnect({ address });

            console.error(`${formatPrefix('ERROR')} Could not find write service. Did find these services: ${JSON.stringify(device.services)}`);
            this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: 'No write service found...' });
            return;
          }

          const readService = device.services.find((x) => x.characteristics.some((y) => y.uuid === this.READ_CHAR_UUID));
          if (!readService) {
            await BluetoothLE.disconnect({ address });

            console.error(`${formatPrefix('ERROR')} Could not find write service. Did find these services: ${JSON.stringify(device.services)}`);
            this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: 'No write service found...' });
            return;
          }

          this.WRITE_SERVICE_UUID = writeService.uuid;
          this.READ_SERVICE_UUID = readService.uuid;
          this.enableNotify(address);

          // Send 1st packet
          const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PUMP_CHECK, undefined, this.deviceName);
          await this.writeQ(data);

          this.connectingSubject.next({ code: ConnectionEvents.Securing });
        } catch (e) {
          console.error(`${formatPrefix('ERROR')} Error while connecting to device: ${address}`, e);
          this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: ' Error while connecting to device...' });
        }
      },
      error: (e) => {
        console.error(`${formatPrefix('ERROR')} Error while connecting to device: ${address}`, e);
        this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: ' Error while connecting to device...' });
      },
    });

    return this.connectingSubject.asObservable();
  }

  private enableNotify(address: string) {
    if (!this.READ_SERVICE_UUID) {
      console.error(`${formatPrefix('ERROR')} No read service found in device...`);
      throw new Error('No read service found in device...');
    }

    BluetoothLE.subscribe({ address, service: this.READ_SERVICE_UUID, characteristic: this.READ_SERVICE_UUID }).subscribe({
      next: (result) => {
        if (result.status !== 'subscribedResult') {
          return;
        }

        console.log(`${formatPrefix()} Received data via subscription: ${result.value}`);
        this.parseReadData(result.value);
      },
      error: (e) => {
        console.error(`${formatPrefix('ERROR')} Error during subscribing to service: ${this.READ_SERVICE_UUID}, char: ${this.READ_CHAR_UUID}`, e);
      },
    });
  }

  private parseReadData(dataEncoded: string) {
    let data = BluetoothLE.encodedStringToBytes(dataEncoded);

    if (this.encryptionType !== ENCRYPTION_TYPE.DEFAULT) {
      console.log(`${formatPrefix()} Decrypting second level data...`, data.subarray());
      data = DanaRSEncryption.decodeSecondLevel(data);
    }

    this.readBuffer = new Uint8Array([...this.readBuffer, ...data]);
    if (this.readBuffer.length < 6) {
      // Buffer is not ready to be processed
      return;
    }

    if (
      !(this.readBuffer[0] === this.PACKET_START_BYTE || this.readBuffer[0] === this.ENCRYPTED_START_BYTE) ||
      !(this.readBuffer[1] === this.PACKET_START_BYTE || this.readBuffer[1] === this.ENCRYPTED_START_BYTE)
    ) {
      // The buffer does not start with the opening bytes. Check if the buffer is filled with old data
      const indexUnencrypted = this.readBuffer.findIndex((x) => x === this.PACKET_START_BYTE);
      const indexEncrypted = this.readBuffer.findIndex((x) => x === this.ENCRYPTED_START_BYTE);
      if (indexUnencrypted !== -1 || indexEncrypted !== -1) {
        // Remove old data
        const index = Math.max(indexUnencrypted, indexEncrypted);
        this.readBuffer = this.readBuffer.subarray(index);
      } else {
        // Invalid packets received...
        console.error(`${formatPrefix('ERROR')} Received invalid packets. Starting bytes do not exists...`, this.readBuffer.subarray());
        this.readBuffer = new Uint8Array();
        return;
      }
    }

    const length = this.readBuffer[2];
    if (length + 7 > this.readBuffer.length) {
      // Not all packets have been received yet...
      return;
    }

    if (
      !(this.readBuffer[length + 5] === this.PACKET_END_BYTE || this.readBuffer[length + 5] === this.ENCRYPTED_END_BYTE) ||
      !(this.readBuffer[length + 6] === this.PACKET_END_BYTE || this.readBuffer[length + 6] === this.ENCRYPTED_END_BYTE)
    ) {
      // Invalid packets received...
      console.error(`${formatPrefix('ERROR')} Received invalid packets. Ending bytes do not match...`, this.readBuffer.subarray());
      this.readBuffer = new Uint8Array();
      return;
    }

    // Ready to process the received message!
    console.log(`${formatPrefix()} Received message! Starting to decrypt data...`, this.readBuffer.subarray());

    const decryptedData = DanaRSEncryption.decodePacket(this.readBuffer.subarray(), this.deviceName);
    this.readBuffer = new Uint8Array();

    const encryptionMessage = decryptedData[0] === DANA_PACKET_TYPE.TYPE_ENCRYPTION_RESPONSE;
    console.log(`${formatPrefix()} Decoding successful! Start processing ${encryptionMessage ? 'encryption' : 'normal'} message`, decryptedData);

    if (encryptionMessage) {
      switch (decryptedData[1]) {
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PUMP_CHECK:
          this.processConnectResponse(decryptedData);
          return;
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION:
          this.processEncryptionResponse(decryptedData);
          return;
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__CHECK_PASSKEY:
          if (decryptedData[2] === 0x05) {
            this.sendTimeInfo();
          } else {
            this.sendPairingRequest();
          }
          return;
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PASSKEY_REQUEST:
          this.processPairingRequest(decryptedData);
          return;
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PASSKEY_RETURN:
          this.processPairingRequest2(decryptedData);
          return;
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__GET_PUMP_CHECK:
          if (decryptedData[2] === 0x05) {
            this.sendTimeInfo();
          } else {
            this.sendEasyMenuCheck();
          }
          return;
        case DANA_PACKET_TYPE.OPCODE_ENCRYPTION__GET_EASYMENU_CHECK:
          this.processEasyMenuCheck(decryptedData);
          return;
      }
    }

    // Received a non-encryption message
    this.processMessage(decryptedData);
  }

  private sendTimeInfo() {
    // Device name not needed for time info
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION, undefined, '');
    this.writeQ(data);
  }

  private sendPairingRequest() {
    // Device name not needed for passkey request
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PASSKEY_REQUEST, undefined, '');
    this.writeQ(data);
  }

  private sendEasyMenuCheck() {
    // Device name not needed for easy menu check
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__GET_EASYMENU_CHECK, undefined, '');
    this.writeQ(data);
  }

  private async processPairingRequest(data: Uint8Array) {
    if (data[2] !== 0x00) {
      console.error(`${formatPrefix()} Passkey request failed...`, data);
      this.connectingSubject.next({ code: ConnectionEvents.FailedSecuring, message: 'Passkey request failed...' });

      await BluetoothLE.disconnect({ address: this.deviceAddress });
      return;
    }
  }

  private processEasyMenuCheck(data: Uint8Array) {
    this.isEasyMode = data[2] === 0x01;
    this.isUnitUD = data[3] === 0x01;

    if (this.encryptionType === ENCRYPTION_TYPE.RSv3) {
      this.sendV3PairingInformation();
    } else {
      this.sendTimeInfo();
    }
  }

  private async writeQ(data: Uint8Array) {
    await BluetoothLE.writeQ({
      address: this.deviceAddress,
      service: this.WRITE_SERVICE_UUID,
      characteristic: this.WRITE_CHAR_UUID,
      value: BluetoothLE.bytesToEncodedString(data),
    });
  }
}

function formatPrefix(level: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') {
  return `[${new Date().toISOString()} ${level}]`;
}
