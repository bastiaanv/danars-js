import { BleComm } from './ble.comm';
import { ConnectionEvents } from './events/connection.events';
import { BasalTempActivateModel } from './models/basal.temp.activate.model';
import { BasalUpdateProfileModel } from './models/basal.update.profile.model';
import { BaseModel } from './models/base.model';
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
import { filter, firstValueFrom, map } from 'rxjs';

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

  private async connectAsync(address: string) {
    const subscription = await this.connect(address);
    if (!subscription) {
      // If empty, the app is already connected and we can skip this
      return true;
    }

    return firstValueFrom(
      subscription.pipe(
        filter((x) => x.code === ConnectionEvents.Connected || x.code < 0),
        map((x) => x.code > 0)
      )
    );
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

  public async getInitialState(options: BaseModel) {
    const isConnected = await this.connectAsync(options.address);
    if (!isConnected) {
      throw new Error('Failed to connect...');
    }

    const request = generatePacketGeneralGetInitialScreenInformation();
    const response = await this.bleComm.writeMessage(request);
    if (!response.success) {
      console.error(`${formatPrefix('ERROR')} Failed to do bolus...`, response);
      throw new Error('Failed to do bolus...');
    }

    await this.disconnect();

    return response.data as PacketGeneralGetInitialScreenInformation;
  }

  public async bolusStart(options: BolusStartModel) {
    const isConnected = await this.connectAsync(options.address);
    if (!isConnected) {
      throw new Error('Failed to connect...');
    }

    const bolusRequest = generatePacketBolusStart({ amount: options.amount, speed: options.speed ?? 12 });

    const bolusResponse = await this.bleComm.writeMessage(bolusRequest);
    if (!bolusResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to do bolus...`, bolusResponse);
      throw new Error('Failed to do bolus...');
    }

    await this.disconnect();
  }

  public async bolusStop(options: BaseModel) {
    const isConnected = await this.connectAsync(options.address);
    if (!isConnected) {
      throw new Error('Failed to connect...');
    }

    const stopRequest = generatePacketBolusStop();

    const stopResponse = await this.bleComm.writeMessage(stopRequest);
    if (!stopResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to stop bolus...`, stopResponse);
      throw new Error('Failed to stop bolus...');
    }

    await this.disconnect();
  }

  public async setBasal(options: BasalUpdateProfileModel) {
    const isConnected = await this.connectAsync(options.address);
    if (!isConnected) {
      throw new Error('Failed to connect...');
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

    const basalProfileRequest = generatePacketBasalSetProfileNumber({ profileNumber: options.profileNumber });
    const basalProfileResponse = await this.bleComm.writeMessage(basalProfileRequest);
    if (!basalProfileResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to switch to updated profile number`, { response: basalProfileResponse, request: basalProfileRequest });
      throw new Error('Failed to switch to profile number...');
    }

    await this.disconnect();
  }

  public async setTempBasal(options: BasalTempActivateModel) {
    const isConnected = await this.connectAsync(options.address);
    if (!isConnected) {
      throw new Error('Failed to connect...');
    }

    options.durationInHours = Math.floor(options.durationInHours);

    const tempBasalRequest = generatePacketBasalSetTemporary({ temporaryBasalRatio: options.percent, temporaryBasalDuration: options.durationInHours });
    const tempBasalResponse = await this.bleComm.writeMessage(tempBasalRequest);
    if (!tempBasalResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to start temporary basal`, { response: tempBasalResponse, request: tempBasalRequest });
      throw new Error('Failed to start temporary basal');
    }

    await this.disconnect();
  }

  public async stopTempBasal(options: BaseModel) {
    const isConnected = await this.connectAsync(options.address);
    if (!isConnected) {
      throw new Error('Failed to connect...');
    }

    const stopRequest = generatePacketBasalCancelTemporary();
    const stopResponse = await this.bleComm.writeMessage(stopRequest);
    if (!stopResponse.success) {
      console.error(`${formatPrefix('ERROR')} Failed to stop temporary basal`, { response: stopResponse, request: stopRequest });
      throw new Error('Failed to stop temporary basal');
    }

    await this.disconnect();
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
