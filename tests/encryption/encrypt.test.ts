import { encrypt, encryptSecondLevel } from '../../src/encryption/encrypt';
import { DANA_PACKET_TYPE } from '../../src/packets/dana.type.message.enum';
import { Ble5Keys, DEVICE_NAME } from '../contants';

describe('Encryption tests', () => {
  it('Should encode pump check command', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PUMP_CHECK,
      data: undefined,
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 12, 233, 243, 217, 162, 187, 191, 216, 195, 190, 218, 181, 198, 84, 137, 90, 90]));
  });

  it('Should encode time information command', () => {
    // TIME_INFORMATION command -> sendBLE5PairingInformation
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION,
      data: new Uint8Array([0, 0, 0, 0]),
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 6, 233, 242, 143, 232, 243, 143, 247, 28, 90, 90]));
  });

  it('Should encode time information command (enhancedEncryption 2)', () => {
    // TIME_INFORMATION command -> sendBLE5PairingInformation
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION,
      data: new Uint8Array([0, 0, 0, 0]),
      deviceName: DEVICE_NAME,
      enhancedEncryption: 2,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 6, 233, 242, 143, 229, 226, 137, 183, 82, 90, 90]));
  });

  it('Should encode time information command (empty)', () => {
    // TIME_INFORMATION command -> sendTimeInfo
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__TIME_INFORMATION,
      data: undefined,
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 2, 233, 242, 134, 120, 90, 90]));
  });

  it('Should encode get pump check command', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__GET_PUMP_CHECK,
      data: undefined,
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 2, 233, 0, 81, 109, 90, 90]));
  });

  it('Should encode get easy menu check command', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__GET_EASYMENU_CHECK,
      data: undefined,
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 2, 233, 7, 33, 82, 90, 90]));
  });

  it('Should encode passkey request command', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__PASSKEY_REQUEST,
      data: undefined,
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 2, 233, 34, 80, 77, 90, 90]));
  });

  it('Should encode check passkey command', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_ENCRYPTION__CHECK_PASSKEY,
      // TODO: Get real example of pairing keys
      data: new Uint8Array([1, 2]),
      deviceName: DEVICE_NAME,
      enhancedEncryption: 0,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(true);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 4, 233, 35, 228, 128, 28, 180, 90, 90]));
  });

  it('Should encode normal command (enhancedEncryption: 2)', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_TEMPORARY_BASAL,
      data: new Uint8Array([200, 1]),
      deviceName: DEVICE_NAME,
      enhancedEncryption: 2,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(false);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 4, 73, 147, 71, 233, 137, 149, 90, 90]));
  });

  it('Should encode normal command (empty data, enhancedEncryption: 2)', () => {
    const param: Parameters<typeof encrypt>[0] = {
      operationCode: DANA_PACKET_TYPE.OPCODE_REVIEW__INITIAL_SCREEN_INFORMATION,
      data: undefined,
      deviceName: DEVICE_NAME,
      enhancedEncryption: 2,
      passKeySecret: [],
      passwordSecret: [],
      timeSecret: [],
    };
    const { data, isEncryptionMode } = encrypt(param);
    expect(isEncryptionMode).toBe(false);
    expect(data).toStrictEqual(new Uint8Array([165, 165, 2, 73, 241, 235, 35, 90, 90]));
  });

  // TODO: Need example keys from older Dana pumps
  // it('Should encode normal command (enhancedEncryption: 0)', () => { });

  // TODO: Need example keys from older Dana pumps
  // it('Should encode second level (enhancedEncryption: 1)', () => { });

  it('Should encode second level (enhancedEncryption: 2)', () => {
    // DANA_PACKET_TYPE.OPCODE_REVIEW__INITIAL_SCREEN_INFORMATION
    const data = new Uint8Array([165, 165, 2, 73, 241, 235, 35, 90, 90]);
    const enhancedEncryption = 2;
    const emptyKey: number[] = [];

    const { randomSyncKey, buffer } = encryptSecondLevel(data, enhancedEncryption, emptyKey, emptyKey, 0, Ble5Keys);
    expect(randomSyncKey).toBe(0);
    expect(buffer).toStrictEqual(new Uint8Array([126, 126, 235, 16, 154, 122, 245, 170, 170]));
  });
});
