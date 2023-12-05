import { encodePacketPassKey, encodePacketPassKeySerialNumber, encodePacketPassword, encodePacketSerialNumber, encodePacketTime } from './common';
import { generateCrc } from './crc';
import { secondLvlEncryptionLookup } from './lookup';

interface DecryptParam {
  data: Uint8Array;
  deviceName: string;
  enhancedEncryption: number;
  useAdvancedEncryptionMode: boolean;
  pairingKeyLength: number;
  randomPairingKeyLength: number;
  ble5KeyLength: number;
  timeSecret: number[];
  passwordSecret: number[];
  passKeySecret: number[];
  passKeySecretBackup: number[];
}

export function decrypt(options: DecryptParam) {
  options.data = encodePacketSerialNumber(options.data, options.deviceName);

  if (!options.useAdvancedEncryptionMode && options.enhancedEncryption == 0) {
    options.data = encodePacketTime(options.data, options.timeSecret);
    options.data = encodePacketPassword(options.data, options.passwordSecret);
    options.data = encodePacketPassKey(options.data, options.passKeySecret);
  }

  if (options.data[2] !== options.data.length - 7) {
    throw new Error(`Package length does not match the length attr. Got: ${options.data.length - 7}, expected: ${options.data[2]}`);
  }

  const content = options.data.subarray(3, options.data[2] + 3);
  const crc = generateCrc(content, options.enhancedEncryption, options.useAdvancedEncryptionMode);
  if (crc >> 8 !== options.data[options.data.length - 4] || (crc & 0xff) !== options.data[options.data.length - 3]) {
    throw new Error('Crc checksum failed...');
  }

  if (content[0] === 0x2 && content[1] == 0xd0 && content[2] === 0x0) {
    // Response for DANAR_PACKET__OPCODE_ENCRYPTION__CHECK_PASSKEY
    options.passKeySecret = options.passKeySecretBackup;
  }
  if (content[0] === 0x2 && content[1] === 0xd2) {
    // Response for ??
    options.passKeySecret = [content[2], content[3]];
    options.passKeySecretBackup = [content[2], content[3]];

    content[2] = encodePacketPassKeySerialNumber(content[2], options.deviceName);
    content[3] = encodePacketPassKeySerialNumber(content[3], options.deviceName);
  }

  if (content[0] === 0x2 && content[1] === 0x1) {
    // Response for DANAR_PACKET__OPCODE_ENCRYPTION__TIME_INFORMATION
    if (options.enhancedEncryption === 1) {
      options.useAdvancedEncryptionMode = options.pairingKeyLength === 0 && options.randomPairingKeyLength === 0;
    } else if (options.enhancedEncryption === 2) {
      options.useAdvancedEncryptionMode = options.ble5KeyLength === 0;
    } else {
      // The initial message
      if (options.data.length !== 0x11) {
        throw new Error('Invalid length for TIME_INFORMATION');
      }

      options.useAdvancedEncryptionMode = false;
      options.timeSecret = Array.from(content.subarray(2));

      options.passwordSecret = Array.from(content.subarray(8, 10));
      options.passwordSecret[0] ^= 0x87;
      options.passwordSecret[1] ^= 0xd;
    }
  }

  return {
    data: content,
    useAdvancedEncryptionMode: options.useAdvancedEncryptionMode,
    timeSecret: options.timeSecret,
    passwordSecret: options.passwordSecret,
    passKeySecret: options.passKeySecret,
    passKeySecretBackup: options.passKeySecretBackup,
  };
}

export function decryptSecondLevel(
  buffer: Uint8Array,
  enhancedEncryption: number,
  pairingKey: number[],
  randomPairingKey: number[],
  randomSyncKey: number,
  bleRandomKeys: [number, number, number]
) {
  if (enhancedEncryption === 1) {
    for (let i = 0; i < buffer.length; i++) {
      const copyRandomSyncKey = buffer[i];

      buffer[i] += secondLvlEncryptionLookup[randomPairingKey[2]];
      buffer[i] -= secondLvlEncryptionLookup[randomPairingKey[1]];
      buffer[i] ^= secondLvlEncryptionLookup[randomPairingKey[0]];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] += secondLvlEncryptionLookup[pairingKey[5]];
      buffer[i] -= secondLvlEncryptionLookup[pairingKey[4]];
      buffer[i] ^= secondLvlEncryptionLookup[pairingKey[3]];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] += secondLvlEncryptionLookup[pairingKey[2]];
      buffer[i] -= secondLvlEncryptionLookup[pairingKey[1]];
      buffer[i] ^= secondLvlEncryptionLookup[pairingKey[0]];
      buffer[i] ^= randomSyncKey;
      buffer[i] ^= pairingKey[5];

      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);
      buffer[i] ^= pairingKey[4];
      buffer[i] += pairingKey[3];

      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);
      buffer[i] ^= pairingKey[2];
      buffer[i] -= pairingKey[1];

      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);
      buffer[i] += randomSyncKey;
      buffer[i] ^= pairingKey[0];

      randomSyncKey = copyRandomSyncKey;
    }

    if (buffer[0] === 0x7a && buffer[1] === 0x7a) {
      buffer[0] = 0xa5;
      buffer[1] = 0xa5;
    }

    if (buffer[buffer.length - 2] === 0x2e && buffer[buffer.length - 1] === 0x2e) {
      buffer[buffer.length - 2] = 0x5a;
      buffer[buffer.length - 1] = 0x5a;
    }
  } else if (enhancedEncryption === 2) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] ^= bleRandomKeys[2];
      buffer[i] += bleRandomKeys[1];

      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);
      buffer[i] -= bleRandomKeys[0];
    }
  }

  return { randomSyncKey, buffer };
}
