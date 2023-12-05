import { ENCRYPTION_TYPE } from './encryption/encryption.type.enum';
import { DanaRSEncryption } from './encryption/index';
import { ConnectionEvents } from './events/connection.events';
import DanaPump from './index';
import { DanaGeneratePacket, DanaParsePacket } from './packets/dana.packet.base';
import { CommandNotifyAlarm, PacketNotifyAlarm } from './packets/dana.packet.notify';
import { CommandNotifyDeliveryComplete, PacketNotifyDeliveryComplete } from './packets/dana.packet.notify.delivery.complete';
import { CommandNotifyDeliveryRateDisplay, PacketNotifyDeliveryRateDisplay } from './packets/dana.packet.notify.delivery.rate.display';
import { CommandNotifyMissedBolus, PacketNotifyMissedBolus } from './packets/dana.packet.notify.missed.bolus';
import { DANA_PACKET_TYPE } from './packets/dana.type.message.enum';
import { parseMessage } from './packets/index';
import { StorageService } from './storage.service';
import { ObjectValues } from './types';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { Subject, filter } from 'rxjs';

type ConnectingEvents = { code: ObjectValues<typeof ConnectionEvents>; message?: string | undefined };

const okCharCodes = [
  0x4f, // O
  0x4b, // K
];

const pumpCharCodes = [
  0x50, // P
  0x55, // U
  0x4d, // M
  0x50, // P
];

const busyCharCodes = [
  0x42, // B
  0x55, // U
  0x53, // S
  0x59, // Y
];

const deviceNameRegex = new RegExp(/^([a-zA-Z]{3})([0-9]{5})([a-zA-Z]{2})$/);

export class BleComm {
  // Event emitters
  private readonly connectingSubject = new Subject<ConnectingEvents>();

  private readonly notificationAlarmSubject = new Subject<DanaParsePacket<PacketNotifyAlarm>>();
  public readonly notificationAlarm$ = this.notificationAlarmSubject.asObservable();

  private readonly notificationMissedBolusSubject = new Subject<DanaParsePacket<PacketNotifyMissedBolus>>();
  public readonly notificationMissedBolus$ = this.notificationMissedBolusSubject.asObservable();

  private readonly notificationDeliveryCompleteSubject = new Subject<DanaParsePacket<PacketNotifyDeliveryComplete>>();
  public readonly notificationDeliveryComplete$ = this.notificationDeliveryCompleteSubject.asObservable();

  private readonly notificationDeliveryRateDisplaySubject = new Subject<DanaParsePacket<PacketNotifyDeliveryRateDisplay>>();
  public readonly notificationDeliveryRateDisplay$ = this.notificationDeliveryRateDisplaySubject.asObservable();

  // Constant
  private readonly PACKET_START_BYTE = 0xa5;
  private readonly PACKET_END_BYTE = 0x5a;
  private readonly ENCRYPTED_START_BYTE = 0xaa;
  private readonly ENCRYPTED_END_BYTE = 0xee;

  private READ_SERVICE_UUID = '';
  private readonly READ_CHAR_UUID = 'FFF1';
  // private readonly BLE5_DESCRIPTOR_UUID = '00002902-0000-1000-8000-00805f9b34fb';

  private WRITE_SERVICE_UUID = '';
  private readonly WRITE_CHAR_UUID = 'FFF2';

  // Device specific fields
  private deviceName = '';
  private deviceAddress = '';
  private _isConnected = false;

  // NOTE: usage of `isEasyMode` and `isUnitUD` is unknown
  private isEasyMode = false;
  private isUnitUD = false;

  private commScheduler: Record<number, { callback: (data: DanaParsePacket<unknown>) => void; timeout: any }> = {};

  private _encryptionType: ObjectValues<typeof ENCRYPTION_TYPE> = ENCRYPTION_TYPE.DEFAULT;

  private set encryptionType(value: typeof this._encryptionType) {
    console.log(`Using encryption level: ${value}`);
    this._encryptionType = value;
    DanaRSEncryption.setEnhancedEncryption(value);
  }

  private get encryptionType() {
    return this._encryptionType;
  }

  public get isConnected() {
    return this._isConnected;
  }

  private set isConnected(value: boolean) {
    this._isConnected = value;
  }

  // Buffers
  private readBuffer: Uint8Array = new Uint8Array(0);

  constructor(private readonly pump: DanaPump) {}
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
    return BluetoothLE.startScan({ isConnectable: true, allowDuplicates: false }).pipe(
      filter((x) => x.status === 'scanResult' && !!x.name && deviceNameRegex.test(x.name))
    );
  }

  public stopScan() {
    return BluetoothLE.stopScan();
  }

  public async connect(address: string) {
    // Catch the "neverConnected"-exception
    if ((await BluetoothLE.isConnected({ address }).catch(() => ({ isConnected: false }))).isConnected) {
      console.warn(`${formatPrefix('WARNING')} Already connected to device: ${address}`);
      return;
    }

    this.encryptionType = ENCRYPTION_TYPE.DEFAULT;

    console.log(`${formatPrefix()} Connecting to device...`, { address });
    BluetoothLE.connect({ address, autoConnect: true }).subscribe({
      next: async (connectInfo) => {
        if (connectInfo.status !== 'connected') {
          this.isConnected = false;

          await BluetoothLE.close({ address });

          console.log(`${formatPrefix('WARNING')} Device status for ${connectInfo.name} changed to ${connectInfo.status}`);
          this.connectingSubject.next({
            code: ConnectionEvents.Disconnected,
            message: `Disconnected from device: ${connectInfo.name} (${connectInfo.address})`,
          });
          return;
        }

        if (!connectInfo.name) {
          await this.disconnect(address);

          console.error(`${formatPrefix('ERROR')} Empty device name received...`, connectInfo);
          this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: 'Empty device name received...' });
          return;
        }

        this.deviceAddress = connectInfo.address;
        this.deviceName = connectInfo.name;

        this.connectingSubject.next({ code: ConnectionEvents.DeviceFound });
        try {
          const device = await BluetoothLE.discover({ address, clearCache: true });
          const writeService = device.services.find((x) => x.characteristics.some((y) => y.uuid.toUpperCase() === this.WRITE_CHAR_UUID));
          if (!writeService) {
            await this.disconnect(address);

            console.error(`${formatPrefix('ERROR')} Could not find write service. Did find these services: ${JSON.stringify(device.services)}`);
            this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: 'No write service found...' });
            return;
          }

          const readService = device.services.find((x) => x.characteristics.some((y) => y.uuid.toUpperCase() === this.READ_CHAR_UUID));
          if (!readService) {
            await this.disconnect(address);

            console.error(`${formatPrefix('ERROR')} Could not find write service. Did find these services: ${JSON.stringify(device.services)}`);
            this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: 'No write service found...' });
            return;
          }

          this.WRITE_SERVICE_UUID = writeService.uuid;
          this.READ_SERVICE_UUID = readService.uuid;
          console.log(`${formatPrefix()} Discovery completed!`, { device });

          await this.enableNotify(address);

          // Send 1st packet
          const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PUMP_CHECK, undefined, this.deviceName);
          await this.writeQ(data);

          this.connectingSubject.next({ code: ConnectionEvents.Securing });
        } catch (e) {
          console.error(`${formatPrefix('ERROR')} Error while connecting to device: ${address}`, e);
          this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: ' Error while connecting to device...' });
        }
      },
      error: async (e) => {
        console.error(`${formatPrefix('ERROR')} Error while connecting to device: ${address}`, e);
        await BluetoothLE.close({ address });
        this.connectingSubject.next({ code: ConnectionEvents.FailedConnecting, message: ' Error while connecting to device...' });
      },
    });

    return this.connectingSubject.asObservable();
  }

  public async writeMessage(packet: DanaGeneratePacket) {
    if (this.commScheduler[packet.opCode]) {
      throw new Error('This message is not done processing...');
    }

    console.log(`${formatPrefix()} Encrypting data`, packet);

    let data = DanaRSEncryption.encodePacket(packet.opCode, packet.data, this.deviceName);
    if (this.encryptionType !== ENCRYPTION_TYPE.DEFAULT) {
      const firstLvlEncryption = structuredClone(data);
      data = DanaRSEncryption.encodeSecondLevel(data);
      console.log(`${formatPrefix()} Encrypted second level`, { firstLvl: firstLvlEncryption, secondLvl: data, encryptionType: this.encryptionType });
    }

    while (data.length !== 0) {
      // Max message size is 20
      const end = Math.min(20, data.length);
      const message = data.subarray(0, end);

      await this.writeQ(message);
      data = data.subarray(end);
    }

    // Now schedule a 5 sec timeout for the pump to send its message back
    // This timeout will be cancelled by `processMessage` once it received the message
    // If this timeout expired, disconnect from the pump and prompt an error...
    return new Promise<DanaParsePacket<unknown>>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error(`${formatPrefix('ERROR')} Send message timeout hit! Disconnecting from device...`, packet);
        this.disconnect();
        reject();
      }, 5000);

      this.commScheduler[packet.opCode + (packet.type ?? DANA_PACKET_TYPE.TYPE_RESPONSE)] = {
        callback: (data: DanaParsePacket<unknown>) => resolve(data),
        timeout,
      };
    });
  }

  private enableNotify(address: string) {
    if (!this.READ_SERVICE_UUID) {
      console.error(`${formatPrefix('ERROR')} No read service found in device...`);
      throw new Error('No read service found in device...');
    }

    return new Promise<void>((resolve) => {
      BluetoothLE.subscribe({ address, service: this.READ_SERVICE_UUID, characteristic: this.READ_CHAR_UUID }).subscribe({
        next: (result) => {
          if (result.status === 'subscribed') {
            console.log(`${formatPrefix()} Subscribed to data!`);
            resolve();
            return;
          }

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
    });
  }

  private parseReadData(dataEncoded: string) {
    let data = BluetoothLE.encodedStringToBytes(dataEncoded);

    if (this.isConnected && this.encryptionType !== ENCRYPTION_TYPE.DEFAULT) {
      const secondLvlEncrypted = structuredClone(data);
      data = DanaRSEncryption.decodeSecondLevel(data);
      console.log(`${formatPrefix()} Decrypted second level data...`, { encrypted: secondLvlEncrypted, decrypted: data });
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
        console.error(`${formatPrefix('ERROR')} Received invalid packets. Starting bytes do not exists...`, structuredClone(this.readBuffer));
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
      console.error(`${formatPrefix('ERROR')} Received invalid packets. Ending bytes do not match...`, structuredClone(this.readBuffer));
      this.readBuffer = new Uint8Array();
      return;
    }

    // Ready to process the received message!
    console.log(`${formatPrefix()} Received message! Starting to decrypt data...`, structuredClone(this.readBuffer));

    const decryptedData = DanaRSEncryption.decodePacket(structuredClone(this.readBuffer), this.deviceName);
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
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION, undefined, this.deviceName);

    console.log(`${formatPrefix()} Sending normal time information...`, {});
    this.writeQ(data);
  }

  private sendPairingRequest() {
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PASSKEY_REQUEST, undefined, this.deviceName);

    console.log(`${formatPrefix()} Sending Passkey request...`, {});
    this.writeQ(data);
  }

  private sendEasyMenuCheck() {
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__GET_EASYMENU_CHECK, undefined, this.deviceName);

    console.log(`${formatPrefix()} Sending get EasyMenu Check...`, {});
    this.writeQ(data);
  }

  private async processPairingRequest(data: Uint8Array) {
    if (data[2] !== 0x00) {
      console.error(`${formatPrefix()} Passkey request failed...`, data);
      this.connectingSubject.next({ code: ConnectionEvents.FailedSecuring, message: 'Passkey request failed...' });

      await this.disconnect();
      return;
    }
  }

  private processEasyMenuCheck(data: Uint8Array) {
    this.isEasyMode = data[2] === 0x01;
    this.isUnitUD = data[3] === 0x01;

    if (this.encryptionType === ENCRYPTION_TYPE.RSv3) {
      this.sendV3PairingInformationEmpty();
    } else {
      this.sendTimeInfo();
    }
  }

  private async sendV3PairingInformationEmpty() {
    const [pairingKey, randomPairingKey] = await Promise.all([StorageService.getPairingKey(), StorageService.getRandomPairingKey()]);

    if (!pairingKey || !randomPairingKey) {
      this.sendV3PairingInformation(1);
      return;
    }

    const randomSyncKey = await StorageService.getRandomSyncKey();
    DanaRSEncryption.setPairingKeys(pairingKey, randomPairingKey, randomSyncKey);
    this.sendV3PairingInformation(0);
  }

  private sendV3PairingInformation(requestNewPairing: number) {
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION, new Uint8Array([requestNewPairing]), this.deviceName);

    console.log(`${formatPrefix()} Sending RSv3 time information...`, { requestNewPairing });
    this.writeQ(data);
  }

  private sendBLE5PairingInformation() {
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION, new Uint8Array([0, 0, 0, 0]), this.deviceName);

    console.log(`${formatPrefix()} Sending BLE5 time information...`, { ble5Data: [0, 0, 0, 0] });
    this.writeQ(data);
  }

  // only after entering PIN codes
  public async finishV3Pairing(pairingKey: number[], randomPairingKey: number[]) {
    await Promise.all([StorageService.setPairingKey(pairingKey), StorageService.setRandomPairingKey(randomPairingKey)]);

    DanaRSEncryption.setPairingKeys(pairingKey, randomPairingKey, 0);
    this.sendV3PairingInformation(0);
  }

  private async processConnectResponse(data: Uint8Array) {
    if (data.length === 4 && data[2] === okCharCodes[0] && data[3] === okCharCodes[1]) {
      // response OK v1
      this.encryptionType = ENCRYPTION_TYPE.DEFAULT;
      this.pump.ignoreUserPassword = false;

      const pairingKey = await StorageService.getPairingKey();
      if (pairingKey) {
        this.sendPasskeyCheck(pairingKey);
      } else {
        this.sendPairingRequest();
      }
    } else if (data.length === 9 && data[2] === okCharCodes[0] && data[3] === okCharCodes[1]) {
      // response OK v3, 2nd layer encryption
      this.encryptionType = ENCRYPTION_TYPE.RSv3;

      this.pump.ignoreUserPassword = true;
      this.pump.hwModel = data[5];
      this.pump.protocol = data[7];
      await StorageService.setRandomSyncKey(data[8]);

      if (this.pump.hwModel === 0x05) {
        // Dana RS Pump
        this.sendV3PairingInformationEmpty();
      } else if (this.pump.hwModel === 0x06) {
        // Dana RS Easy
        this.sendEasyMenuCheck();
      }
    } else if (data.length === 14 && data[2] === okCharCodes[0] && data[3] === okCharCodes[1]) {
      // response OK BLE5, 2nd layer encryption
      this.encryptionType = ENCRYPTION_TYPE.BLE_5;

      this.pump.ignoreUserPassword = true;
      this.pump.hwModel = data[5];
      this.pump.protocol = data[7];

      const ble5Keys = Array.from(data.subarray(8, 14));
      if (data[8] !== 0) {
        await StorageService.setBle5Key(ble5Keys);
      }

      if (this.pump.hwModel === 0x09 || this.pump.hwModel === 0x0a) {
        DanaRSEncryption.setBle5Key(ble5Keys);
        this.sendBLE5PairingInformation();
      }
    } else if (
      data.length === 6 &&
      data[2] === pumpCharCodes[0] &&
      data[3] === pumpCharCodes[1] &&
      data[4] === pumpCharCodes[2] &&
      data[5] === pumpCharCodes[3]
    ) {
      // response PUMP : error status
      console.error(`${formatPrefix('ERROR')} PUMP_CHECK error`, data);
      this.connectingSubject.next({ code: ConnectionEvents.PumpCheckError, message: 'PUMP_CHECK error' });
    } else if (
      data.length === 6 &&
      data[2] === busyCharCodes[0] &&
      data[3] === busyCharCodes[1] &&
      data[4] === busyCharCodes[2] &&
      data[5] === busyCharCodes[3]
    ) {
      // response BUSY: error status
      console.error(`${formatPrefix('ERROR')} PUMP_CHECK_BUSY error`, data);
      this.connectingSubject.next({ code: ConnectionEvents.PumpCheckError, message: 'PUMP_CHECK_BUSY error' });
    } else {
      // ERROR in response, wrong serial number
      console.error(`${formatPrefix('ERROR')} PUMP_CHECK error, wrong serial number`, data);
      this.connectingSubject.next({ code: ConnectionEvents.PumpCheckError, message: 'PUMP_CHECK_SERIAL error' });

      await StorageService.clear();
    }
  }

  private async processEncryptionResponse(data: Uint8Array) {
    if (this.encryptionType === ENCRYPTION_TYPE.BLE_5) {
      this.isConnected = true;
      console.log(`${formatPrefix()} Connection successful!`, { address: this.deviceAddress, name: this.deviceName });
      this.connectingSubject.next({ code: ConnectionEvents.Connected });
    } else if (this.encryptionType === ENCRYPTION_TYPE.RSv3) {
      // data[2] : 0x00 OK  0x01 Error, No pairing
      if (data[2] === 0x00) {
        const [pairingKey, randomPairingKey] = await Promise.all([StorageService.getPairingKey(), StorageService.getRandomPairingKey()]);

        if (!pairingKey || !randomPairingKey) {
          console.warn(`${formatPrefix('WARNING')} Request pairing keys...`, { pairingKey, randomPairingKey });
          this.connectingSubject.next({ code: ConnectionEvents.RequestingPairingKeys });
          return;
        }

        this.isConnected = true;
        console.log(`${formatPrefix()} Connection successful!`, { address: this.deviceAddress, name: this.deviceName });
        this.connectingSubject.next({ code: ConnectionEvents.Connected });
      } else {
        this.sendV3PairingInformation(1);
      }
    } else {
      const password = (((data[data.length - 1] & 0xff) << 8) + (data[data.length - 2] & 0xff)) ^ 0x0d87;
      if (this.pump.password !== password && !this.pump.ignoreUserPassword) {
        await this.disconnect();

        console.error(`${formatPrefix('ERROR')} Wrong password...`, { data, password, storedPassword: this.pump.password });
        this.connectingSubject.next({ code: ConnectionEvents.WrongPassword, message: 'Wrong password...' });
        return;
      }

      this.isConnected = true;
      console.log(`${formatPrefix()} Connection successful!`, { address: this.deviceAddress, name: this.deviceName });
      this.connectingSubject.next({ code: ConnectionEvents.Connected });
    }
  }

  private async processPairingRequest2(data: Uint8Array) {
    // Paring is successful, sending time info
    this.sendTimeInfo();

    const pairingKey = Array.from(data.subarray(2, 4));
    await StorageService.setPairingKey(pairingKey);
  }

  private sendPasskeyCheck(pairingKey: number[]) {
    const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__CHECK_PASSKEY, new Uint8Array(pairingKey), this.deviceName);

    console.log(`${formatPrefix()} Sending Passkey check...`, { pairingKey });
    this.writeQ(data);
  }

  private processMessage(data: Uint8Array) {
    const message = parseMessage(data, this.pump.usingUTC);
    if (!message) {
      console.warn(`${formatPrefix('WARNING')} Received unparsable message (or history packet)`, data);
      return;
    }

    if (message.notifyType) {
      switch (message.notifyType) {
        case CommandNotifyMissedBolus:
          this.notificationMissedBolusSubject.next(message.data as any);
          return;
        case CommandNotifyDeliveryRateDisplay:
          this.notificationDeliveryRateDisplaySubject.next(message.data as any);
          return;
        case CommandNotifyDeliveryComplete:
          this.notificationDeliveryCompleteSubject.next(message.data as any);
          return;
        case CommandNotifyAlarm:
          this.notificationAlarmSubject.next(message.data as any);
          return;
        default:
          console.error(`${formatPrefix('ERROR')} Unknown notification received...`, { message });
          return;
      }
    }

    const scheduledMessage = this.commScheduler[message.command];
    if (!scheduledMessage) {
      console.warn(`${formatPrefix('WARNING')} No scheduler found for this message...`, message);
      return;
    }

    scheduledMessage.callback(message);
    clearTimeout(scheduledMessage.timeout);
  }

  private async writeQ(data: Uint8Array) {
    console.log(`${formatPrefix()} Writing data...`, { data });

    await BluetoothLE.write({
      address: this.deviceAddress,
      service: this.WRITE_SERVICE_UUID,
      characteristic: this.WRITE_CHAR_UUID,
      value: BluetoothLE.bytesToEncodedString(data),
      type: 'noResponse',
    });
  }

  private async disconnect(address?: string | undefined) {
    await BluetoothLE.disconnect({ address: address || this.deviceAddress });
    await BluetoothLE.close({ address: address || this.deviceAddress });

    console.log(`${formatPrefix('WARNING')} Disconnected from device...`, { name: this.deviceName, address: address || this.deviceAddress });

    this.deviceAddress = '';
    this.deviceName = '';
    this.encryptionType = ENCRYPTION_TYPE.DEFAULT;
  }
}

function formatPrefix(level: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') {
  return `[${new Date().toISOString()} ${level}]`;
}
