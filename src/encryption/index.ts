import { decryptionRandomSyncKey, initialRandomSyncKey } from './common';
import { decrypt, decryptSecondLevel } from './decrypt';
import { encrypt, encryptSecondLevel } from './encrypt';
import { secondLvlEncryptionLookupShort } from './lookup';

export class DanaRSEncryption {
  private static enhancedEncryption = 0;
  private static useAdvancedEncryptionMode = true;

  /** Length 2 */
  private static passwordSecret: number[] = [];

  /** Length: 6 */
  private static timeSecret: number[] = [];

  /** Length: 2 */
  private static passKeySecret: number[] = [];
  private static passKeySecretBackup: number[] = [];

  /** Length: 6 */
  private static pairingKey: number[] = [];

  /** Length: 3 */
  private static randomPairingKey: number[] = [];
  private static randomSyncKey = 0;

  /** Length: 6 */
  private static ble5Key: number[] = [];
  private static ble5RandomKeys: [number, number, number] = [0, 0, 0];

  // Encoding functions -> Encryption in JNI lib
  static encodePacket(operationCode: number, buffer: Uint8Array | undefined, deviceName: string) {
    const encryptParams: Parameters<typeof encrypt>[0] = {
      operationCode,
      data: buffer,
      deviceName,
      enhancedEncryption: this.enhancedEncryption,
      timeSecret: this.timeSecret,
      passwordSecret: this.passwordSecret,
      passKeySecret: this.passKeySecret,
    };

    const { data, useAdvancedEncryptionMode } = encrypt(encryptParams);
    this.useAdvancedEncryptionMode = useAdvancedEncryptionMode;

    return data;
  }

  static encodeSecondLevel(buffer: Uint8Array) {
    return encryptSecondLevel(buffer, this.enhancedEncryption, this.pairingKey, this.randomPairingKey, this.randomSyncKey, this.ble5RandomKeys);
  }

  // Decoding function -> Decrypting in JNI lib
  static decodePacket(buffer: Uint8Array, deviceName: string) {
    const decryptParams: Parameters<typeof decrypt>[0] = {
      data: buffer,
      deviceName,
      enhancedEncryption: this.enhancedEncryption,
      useAdvancedEncryptionMode: this.useAdvancedEncryptionMode,
      pairingKeyLength: this.pairingKey.length,
      randomPairingKeyLength: this.randomPairingKey.length,
      ble5KeyLength: this.ble5Key.length,
      passwordSecret: this.passwordSecret,
      passKeySecret: this.passKeySecret,
      timeSecret: this.timeSecret,
      passKeySecretBackup: this.passKeySecretBackup,
    };

    const decryptionResult = decrypt(decryptParams);
    this.useAdvancedEncryptionMode = decryptionResult.useAdvancedEncryptionMode;
    this.timeSecret = decryptionResult.timeSecret;
    this.passwordSecret = decryptionResult.passwordSecret;
    this.passKeySecret = decryptionResult.passKeySecret;
    this.passKeySecretBackup = decryptionResult.passKeySecretBackup;

    return decryptionResult.data;
  }

  static decodeSecondLevel(buffer: Uint8Array) {
    return decryptSecondLevel(buffer, this.enhancedEncryption, this.pairingKey, this.randomPairingKey, this.randomSyncKey, this.ble5RandomKeys);
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
    this.ble5Key = ble5Key;

    this.ble5RandomKeys = [
      secondLvlEncryptionLookupShort[(ble5Key[0] - 0x30) * 10 + ble5Key[1]],
      secondLvlEncryptionLookupShort[(ble5Key[2] - 0x30) * 10 + ble5Key[3]],
      secondLvlEncryptionLookupShort[(ble5Key[4] - 0x30) * 10 + ble5Key[5]],
    ];
  }
}
