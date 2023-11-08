import { BleComm } from './ble.comm';

export class DanaPump {
  private bleComm: BleComm;
  private isEasyMode = false;

  private static instance: DanaPump | undefined;
  private constructor() {
    this.bleComm = new BleComm();
  }

  private async init() {
    await this.bleComm.init();
  }

  public static async getInstance() {
    if (!this.instance) {
      this.instance = new DanaPump();
      await this.instance.init();
    }

    return this.instance;
  }
}
