import { decryptionRandomSyncKey, initialRandomSyncKey } from './common';
import { encrypt } from './encrypt';

export class DanaRSEncryption {
  private static enhancedEncryption = 0;

  /** Length: 6 */
  private static pairingKey: number[] = [];

  /** Length: 3 */
  private static randomPairingKey: number[] = [];

  private static randomSyncKey = 0;

  /** Length: 6 */
  private static ble5key: number[] = [];

  // Used for CRC. Known values are: 0, 1
  private static unknownValue = 0;

  static encodePacket(operationCode: number, data: Uint8Array | undefined, deviceName: string) {
    return encrypt(operationCode, data, deviceName, this.enhancedEncryption, this.unknownValue);
  }

  // Common functions
  static setEnhancedEncryption(enhancedEncryption: number) {
    this.enhancedEncryption = enhancedEncryption;
  }

  static setPairingKeys(pairingKey: number[], randomPairingKey: number[], randomSyncKey: number) {
    this.pairingKey = pairingKey;
    this.randomPairingKey = randomPairingKey;

    if (randomSyncKey === 0) {
      this.randomSyncKey = initialRandomSyncKey(pairingKey);
    } else {
      this.randomSyncKey = decryptionRandomSyncKey(randomSyncKey, randomPairingKey);
    }
  }

  static setBle5Key(ble5Key: number[]) {
    this.ble5key = ble5Key;

    // TODO: reverse the following:
    /*
  DAT_00016178 = *(undefined *)
                  ((int)&PTR_checkApp_00015fd4 + (*BLE_5_KEY - 0x30) * 10 + (uint)BLE_5_KEY[1]);
  DAT_00016179 = *(undefined *)
                  ((int)&PTR_checkApp_00015fd4 + (BLE_5_KEY[2] - 0x30) * 10 + (uint)BLE_5_KEY[3]);
  DAT_0001617a = *(undefined *)
                  ((int)&PTR_checkApp_00015fd4 + (BLE_5_KEY[4] - 0x30) * 10 + (uint)BLE_5_KEY[5]);
    */
  }
}
