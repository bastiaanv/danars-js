import { BleComm } from './ble.comm';
import { BolusStartModel } from './models/bolus.start.model';
import { getFriendlyDeviceName } from './models/friendly.device.name';
import { generatePacketBolusStart } from './packets/dana.packet.bolus.start';
import { generatePacketLoopSetEventHistory } from './packets/dana.packet.loop.set.event.history';
import { DanaHistoryEntryType } from './packets/dana.type.loop.history.entry.enum';

export class DanaPump {
  private bleComm: BleComm;

  public hwModel = -1;
  public protocol = -1;

  public password = -1;
  public ignoreUserPassword = false;

  public usingUTC = false;

  private static instance: DanaPump | undefined;
  private constructor() {
    this.bleComm = new BleComm(this);
  }

  public get modelFriendlyName() {
    return getFriendlyDeviceName(this.hwModel, this.protocol);
  }

  private async init() {
    await this.bleComm.init();
  }

  public connect(address: string) {
    return this.bleComm.connect(address);
  }

  public startScan() {
    return this.bleComm.startScan();
  }

  public stopScan() {
    return this.bleComm.stopScan();
  }

  public async bolus(options: BolusStartModel) {
    const bolusModel = generatePacketBolusStart({ amount: options.amount, speed: options.speed ?? 12 });

    const bolusResponse = await this.bleComm.writeMessage(bolusModel);
    if (!bolusResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to do bolus...`, bolusResponse);
      throw new Error('Failed to do bolus...');
    }

    if (options.carbohydrates && options.carbohydrates > 0) {
      const historyEventModel = generatePacketLoopSetEventHistory({
        packetType: DanaHistoryEntryType.CARBS,
        time: new Date(),
        param1: options.carbohydrates,
        param2: 0,
        usingUTC: this.usingUTC,
      });

      const historyEventResponse = await this.bleComm.writeMessage(historyEventModel);
      if (!historyEventResponse.success) {
        console.warn(`${formatPrefix('WARNING')} Failed to store history event...`, bolusResponse);
      }
    }
  }

  public static async getInstance() {
    if (!this.instance) {
      this.instance = new DanaPump();
      await this.instance.init();
    }

    return this.instance;
  }
}

function formatPrefix(level: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') {
  return `[${new Date().toISOString()} ${level}]`;
}
