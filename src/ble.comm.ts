import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { filter } from 'rxjs';
import { DanaRSEncryption } from './encryption';
import { DANA_PACKET_TYPE } from './models/dana.type.message.enum';

const deviceNameRegex = new RegExp(/^([a-zA-Z]{3})([0-9]{5})([a-zA-Z]{2})$/);
export class BleComm {
  private READ_SERVICE_UUID = '';
  private readonly READ_CHAR_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
  // private readonly BLE5_DESCRIPTOR_UUID = '00002902-0000-1000-8000-00805f9b34fb';

  private WRITE_SERVICE_UUID = '';
  private readonly WRITE_CHAR_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

  private deviceName = '';
  private deviceAddress = '';

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
      console.log(`${formatPrefix('WARNING')} Already connected to device: ${address}`);
      return;
    }

    return new Promise<void>((resolve, reject) =>
      BluetoothLE.connect({ address, autoConnect: true }).subscribe({
        next: async (connectInfo) => {
          if (connectInfo.status !== 'connected') {
            console.log(`${formatPrefix('WARNING')} Device status for ${connectInfo.name} changed to ${connectInfo.status}`);
            return;
          }

          this.deviceAddress = connectInfo.address;
          this.deviceName = connectInfo.name;

          try {
            const device = await BluetoothLE.discover({ address, clearCache: true });
            const writeService = device.services.find((x) => x.characteristics.some((y) => y.uuid === this.WRITE_CHAR_UUID));
            if (!writeService) {
              await BluetoothLE.disconnect({ address });

              console.error(`${formatPrefix('ERROR')} Could not find write service. Did find these services: ${JSON.stringify(device.services)}`);
              reject('No write service found...');
              return;
            }

            const readService = device.services.find((x) => x.characteristics.some((y) => y.uuid === this.READ_CHAR_UUID));
            if (!readService) {
              await BluetoothLE.disconnect({ address });

              console.error(`${formatPrefix('ERROR')} Could not find write service. Did find these services: ${JSON.stringify(device.services)}`);
              reject('No write service found...');
              return;
            }

            this.WRITE_SERVICE_UUID = writeService.uuid;
            this.READ_SERVICE_UUID = readService.uuid;
            this.enableNotify(address);

            // Send 1st packet
            const data = DanaRSEncryption.encodePacket(DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PUMP_CHECK, undefined, this.deviceName);
            await BluetoothLE.writeQ({
              address,
              service: this.WRITE_SERVICE_UUID,
              characteristic: this.WRITE_CHAR_UUID,
              value: BluetoothLE.bytesToEncodedString(data),
            });
            resolve();
          } catch (e) {
            console.error(`${formatPrefix('ERROR')} Error while connecting to device: ${address}`, e);
            reject(e);
          }
        },
        error: (e) => {
          console.error(`${formatPrefix('ERROR')} Error while connecting to device: ${address}`, e);
          reject(e);
        },
      })
    );
  }

  private enableNotify(address: string) {
    if (!this.READ_SERVICE_UUID) {
      console.error(`${formatPrefix('ERROR')} No read service found in device...`);
      throw new Error('No read service found in device...');
    }

    // TODO: add logic to subscribe
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
    const data = BluetoothLE.encodedStringToBytes(dataEncoded);
  }
}

function formatPrefix(level: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') {
  return `[${new Date().toISOString()} ${level}]`;
}
