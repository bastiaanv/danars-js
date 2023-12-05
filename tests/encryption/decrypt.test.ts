import { decrypt } from '../../src/encryption/decrypt';
import { DEVICE_NAME } from '../contants';

describe('Decryption tests', () => {
  it('Should decrypt message (enhancedEncryption: 1, isEncryptionMode: true)', () => {
    // OPCODE_ENCRYPTION__PUMP_CHECK
    const decryptionResult = decrypt({
      data: new Uint8Array([165, 165, 14, 234, 243, 192, 163, 190, 134, 184, 225, 185, 222, 197, 183, 222, 197, 31, 241, 90, 90]),
      isEncryptionMode: true,
      enhancedEncryption: 2,
      deviceName: DEVICE_NAME,
      passKeySecret: [],
      passKeySecretBackup: [],
      passwordSecret: [],
      timeSecret: [],
      ble5KeyLength: 0,
      pairingKeyLength: 0,
      randomPairingKeyLength: 0,
    });

    expect(decryptionResult.isEncryptionMode).toBe(true);
    expect(decryptionResult.passKeySecret).toStrictEqual([]);
    expect(decryptionResult.passKeySecretBackup).toStrictEqual([]);
    expect(decryptionResult.passwordSecret).toStrictEqual([]);
    expect(decryptionResult.timeSecret).toStrictEqual([]);
    expect(decryptionResult.data).toStrictEqual(new Uint8Array([2, 0, 79, 75, 77, 9, 80, 18, 54, 54, 54, 56, 54, 54]));
  });

  it('Should throw if length does not match', () => {
    // OPCODE_ENCRYPTION__PUMP_CHECK
    expect(() =>
      decrypt({
        data: new Uint8Array([165, 165, 17, 234, 243, 192, 163, 190, 134, 184, 225, 185, 222, 197, 183, 222, 197, 31, 241, 90, 90]),
        isEncryptionMode: true,
        enhancedEncryption: 2,
        deviceName: DEVICE_NAME,
        passKeySecret: [],
        passKeySecretBackup: [],
        passwordSecret: [],
        timeSecret: [],
        ble5KeyLength: 0,
        pairingKeyLength: 0,
        randomPairingKeyLength: 0,
      })
    ).toThrow();
  });

  it('Should throw if Crc fails', () => {
    // OPCODE_ENCRYPTION__PUMP_CHECK
    expect(() =>
      decrypt({
        data: new Uint8Array([165, 165, 14, 234, 243, 192, 163, 190, 134, 184, 225, 185, 222, 197, 183, 222, 197, 31, 21, 90, 90]),
        isEncryptionMode: true,
        enhancedEncryption: 2,
        deviceName: DEVICE_NAME,
        passKeySecret: [],
        passKeySecretBackup: [],
        passwordSecret: [],
        timeSecret: [],
        ble5KeyLength: 0,
        pairingKeyLength: 0,
        randomPairingKeyLength: 0,
      })
    ).toThrow('Crc checksum failed...');
  });
});
