import { BleComm } from './ble.comm';
import { BasalTempActivateModel } from './models/basal.temp.activate.model';
import { BasalUpdateProfileModel } from './models/basal.update.profile.model';
import { BolusStartModel } from './models/bolus.start.model';
import { getFriendlyDeviceName } from './models/friendly.device.name';
import { generatePacketBasalCancelTemporary } from './packets/dana.packet.basal.cancel.temporary';
import { generatePacketBasalSetProfileNumber } from './packets/dana.packet.basal.set.profile.number';
import { generatePacketBasalSetProfileRate } from './packets/dana.packet.basal.set.profile.rate';
import { generatePacketBasalSetTemporary } from './packets/dana.packet.basal.set.temporary';
import { generatePacketBolusStart } from './packets/dana.packet.bolus.start';
import { generatePacketBolusStop } from './packets/dana.packet.bolus.stop';
import {
  PacketGeneralGetInitialScreenInformation,
  generatePacketGeneralGetInitialScreenInformation,
} from './packets/dana.packet.general.get.initial.screen.information';
import { generatePacketLoopSetEventHistory } from './packets/dana.packet.loop.set.event.history';
import { DanaHistoryEntryType } from './packets/dana.type.loop.history.entry.enum';

export default class DanaPump {
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

  public get isConnected() {
    return this.bleComm.isConnected;
  }

  public get notificationAlarm$() {
    return this.bleComm.notificationAlarm$;
  }

  public get notificationDeliveryRateDisplay$() {
    return this.bleComm.notificationDeliveryRateDisplay$;
  }

  public get notificationDeliveryComplete$() {
    return this.bleComm.notificationDeliveryComplete$;
  }

  public get notificationMissedBolus$() {
    return this.bleComm.notificationMissedBolus$;
  }

  private async init() {
    await this.bleComm.init();
  }

  public connect(address: string) {
    return this.bleComm.connect(address);
  }

  public disconnect() {
    if (!this.isConnected) {
      return;
    }

    return this.bleComm.disconnect();
  }

  public startScan() {
    return this.bleComm.startScan();
  }

  public stopScan() {
    return this.bleComm.stopScan();
  }

  public async getInitialState() {
    const request = generatePacketGeneralGetInitialScreenInformation();
    const response = await this.bleComm.writeMessage(request);
    if (!response.success) {
      console.error(`${formatPrefix('ERROR')} Failed to do bolus...`, response);
      throw new Error('Failed to do bolus...');
    }

    return response.data as PacketGeneralGetInitialScreenInformation;
  }

  public async bolusStart(options: BolusStartModel) {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    const bolusRequest = generatePacketBolusStart({ amount: options.amount, speed: options.speed ?? 12 });

    const bolusResponse = await this.bleComm.writeMessage(bolusRequest);
    if (!bolusResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to do bolus...`, bolusResponse);
      throw new Error('Failed to do bolus...');
    }

    if (options.carbohydrates && options.carbohydrates > 0) {
      const historyEventRequest = generatePacketLoopSetEventHistory({
        packetType: DanaHistoryEntryType.CARBS,
        time: new Date(),
        param1: options.carbohydrates,
        param2: 0,
        usingUTC: this.usingUTC,
      });

      const historyEventResponse = await this.bleComm.writeMessage(historyEventRequest);
      if (!historyEventResponse.success) {
        console.warn(`${formatPrefix('WARNING')} Failed to store history event...`, bolusResponse);
      }
    }
  }

  public async bolusStop() {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    const stopRequest = generatePacketBolusStop();

    const stopResponse = await this.bleComm.writeMessage(stopRequest);
    if (!stopResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to stop bolus...`, stopResponse);
      throw new Error('Failed to stop bolus...');
    }
  }

  public async setBasal(options: BasalUpdateProfileModel) {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    if (options.rates.length !== 24) {
      throw new Error('Invalid basal rate. Length: ' + options.rates.length);
    }

    const basalRateRequest = generatePacketBasalSetProfileRate({ profileBasalRate: options.rates, profileNumber: options.profileNumber });
    const basalRateResponse = await this.bleComm.writeMessage(basalRateRequest);
    if (!basalRateResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to update basal rate of specific profile`, { response: basalRateResponse, request: basalRateRequest });
      throw new Error('Failed to update basal rate...');
    }

    if (options.activateThisProfile) {
      const basalProfileRequest = generatePacketBasalSetProfileNumber({ profileNumber: options.profileNumber });
      const basalProfileResponse = await this.bleComm.writeMessage(basalProfileRequest);
      if (!basalProfileResponse.success) {
        console.error(`${formatPrefix('ERROR')} Failed to switch to updated profile number`, { response: basalProfileResponse, request: basalProfileRequest });
        throw new Error('Failed to switch to profile number...');
      }
    }
  }

  public async setTempBasal(options: BasalTempActivateModel) {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    options.durationInHours = Math.floor(options.durationInHours);

    const tempBasalRequest = generatePacketBasalSetTemporary({ temporaryBasalRatio: options.percent, temporaryBasalDuration: options.durationInHours });
    const tempBasalResponse = await this.bleComm.writeMessage(tempBasalRequest);
    if (!tempBasalResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to start temporary basal`, { response: tempBasalResponse, request: tempBasalRequest });
      throw new Error('Failed to start temporary basal');
    }
  }

  public async stopTempBasal() {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    const stopRequest = generatePacketBasalCancelTemporary();
    const stopResponse = await this.bleComm.writeMessage(stopRequest);
    if (!stopResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to stop temporary basal`, { response: stopResponse, request: stopRequest });
      throw new Error('Failed to stop temporary basal');
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
