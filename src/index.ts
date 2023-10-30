import { decryptionRandomSyncKey, initialRandomSyncKey } from './common';
import { encrypt, encryptSecondLevel } from './encrypt';
import { secondLvlEncryptionLookupShort } from './lookup';

export class DanaRSEncryption {
  private static enhancedEncryption = 0;

  /** Length: 6 */
  private static pairingKey: number[] = [];

  /** Length: 3 */
  private static randomPairingKey: number[] = [];
  private static randomSyncKey = 0;

  /** Length: 6 */
  private static ble5key: number[] = [];
  private static ble5RandomKeys: [number, number, number] = [0, 0, 0];

  static encodePacket(operationCode: number, data: Uint8Array | undefined, deviceName: string) {
    return encrypt(operationCode, data, deviceName, this.enhancedEncryption);
  }

  static encodeSecondLevel(data: Uint8Array) {
    return encryptSecondLevel(data, this.enhancedEncryption, this.pairingKey, this.randomPairingKey, this.randomSyncKey, this.ble5RandomKeys);
  }

  // Setter functions
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

    this.ble5RandomKeys = [
      secondLvlEncryptionLookupShort[(ble5Key[0] - 0x30) * 10 + ble5Key[1]],
      secondLvlEncryptionLookupShort[(ble5Key[2] - 0x30) * 10 + ble5Key[3]],
      secondLvlEncryptionLookupShort[(ble5Key[4] - 0x30) * 10 + ble5Key[5]],
    ];
  }
}
