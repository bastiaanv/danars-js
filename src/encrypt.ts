import { encodePacketPassKey, encodePacketPassKeySerialNumber, encodePacketPassword, encodePacketSerialNumber, encodePacketTime } from './common';
import { generateCrc } from './crc';
import { secondLvlEncryptionLookup } from './lookup';

export function encrypt(operationCode: number, data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number = 0) {
  switch (operationCode) {
    // DANAR_PACKET__OPCODE_ENCRYPTION__PUMP_CHECK
    case 0x00:
      return encodePumpCheckCommand(deviceName, enhancedEncryption);

    // DANAR_PACKET__OPCODE_ENCRYPTION__TIME_INFORMATION
    case 0x01:
      return encodeTimeInformation(data, deviceName, enhancedEncryption);

    // DANAR_PACKET__OPCODE_ENCRYPTION__CHECK_PASSKEY
    case 0xd0:
      return encodeCheckPassKeyCommand(data, deviceName, enhancedEncryption);

    // DANAR_PACKET__OPCODE_ENCRYPTION__PASSKEY_REQUEST
    case 0xd1:
    // DANAR_PACKET__OPCODE_ENCRYPTION__GET_PUMP_CHECK
    case 0xf3:
    // DANAR_PACKET__OPCODE_ENCRYPTION__GET_EASYMENU_CHECK
    case 0xf4:
      return encodeRequestCommand(operationCode, deviceName, enhancedEncryption);

    default:
      return encodeDefault(operationCode, data, deviceName, enhancedEncryption);
  }
}

/**
 * Note: buffer will be edited inline
 * The return value is the new random sync key
 */
export function encryptSecondLevel(
  buffer: Uint8Array,
  enhancedEncryption: number,
  pairingKey: number[],
  randomPairingKey: number[],
  randomSyncKey: number,
  bleRandomKeys: [number, number, number]
) {
  if (enhancedEncryption === 1) {
    if (buffer[0] === 0xa5 && buffer[1] === 0xa5) {
      buffer[0] = 0x7a;
      buffer[1] = 0x7a;
    }

    if (buffer[buffer.length - 2] === 0x5a && buffer[buffer.length - 1] === 0x5a) {
      buffer[buffer.length - 2] = 0x2e;
      buffer[buffer.length - 1] = 0x2e;
    }

    for (let i = 0; i < buffer.length; i++) {
      buffer[i] ^= pairingKey[0];
      buffer[i] -= randomSyncKey;
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] += pairingKey[1];
      buffer[i] ^= pairingKey[2];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] -= pairingKey[3];
      buffer[i] ^= pairingKey[4];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] ^= pairingKey[5];
      buffer[i] ^= randomSyncKey;
      buffer[i] ^= secondLvlEncryptionLookup[pairingKey[0]];
      buffer[i] += secondLvlEncryptionLookup[pairingKey[1]];
      buffer[i] -= secondLvlEncryptionLookup[pairingKey[2]];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] ^= secondLvlEncryptionLookup[pairingKey[3]];
      buffer[i] += secondLvlEncryptionLookup[pairingKey[4]];
      buffer[i] -= secondLvlEncryptionLookup[pairingKey[5]];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] ^= secondLvlEncryptionLookup[randomPairingKey[0]];
      buffer[i] += secondLvlEncryptionLookup[randomPairingKey[1]];
      buffer[i] -= secondLvlEncryptionLookup[randomPairingKey[2]];

      randomSyncKey = buffer[i];
    }
  } else if (enhancedEncryption === 2) {
    if (buffer[0] === 0xa5 && buffer[1] === 0xa5) {
      buffer[0] = 0xaa;
      buffer[1] = 0xaa;
    }

    if (buffer[buffer.length - 2] === 0x5a && buffer[buffer.length - 1] === 0x5a) {
      buffer[buffer.length - 2] = 0xee;
      buffer[buffer.length - 1] = 0xee;
    }

    for (let i = 0; i < buffer.length; i++) {
      buffer[i] += bleRandomKeys[0];
      buffer[i] = ((buffer[i] >> 4) & 0xf) | (((buffer[i] & 0xf) << 4) & 0xff);

      buffer[i] -= bleRandomKeys[1];
      buffer[i] ^= bleRandomKeys[2];
    }
  }

  return randomSyncKey;
}

function encodePumpCheckCommand(deviceName: string, enhancedEncryption: number) {
  const buffer = new Uint8Array(19);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x0c; // length
  buffer[3] = 0x01; // command?
  buffer[4] = 0x00; // pump_check command

  // Device name
  for (let i = 0; i < 10; i++) {
    buffer[5 + i] = deviceName.charCodeAt(i);
  }

  const crc = generateCrc(buffer.subarray(3, 14), enhancedEncryption, true);
  buffer[15] = (crc >> 8) & 0xff; // crc 1
  buffer[16] = crc & 0xff; // crc 2

  buffer[17] = 0x5a; // footer 1
  buffer[18] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeRequestCommand(operationCode: number, deviceName: string, enhancedEncryption: number) {
  const buffer = new Uint8Array(9);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02; // length
  buffer[3] = 0x01; // command?
  buffer[4] = operationCode;

  const crc = generateCrc(buffer.subarray(3, 5), enhancedEncryption, true);
  buffer[5] = (crc >> 8) & 0xff; // crc 1
  buffer[6] = crc & 0xff; // crc 2
  buffer[7] = 0x5a; // footer 1
  buffer[8] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeTimeInformation(data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number) {
  const lengthOfData = data?.length || 0;
  const buffer = new Uint8Array(9 + lengthOfData);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02 + lengthOfData; // length
  buffer[3] = 0x01; // command?
  buffer[4] = 0x01; // time information command

  if (data && data.length > 0) {
    if (enhancedEncryption === 2) {
      data[1] = 0x17 ^ 0x1a;
      data[2] = 0xd1 ^ 0xc0;
      data[3] = 0xaf ^ 0xa9;
    }

    for (let i = 0; i < data.length; i++) {
      buffer[5 + i] = data[i];
    }
  }

  const crc = generateCrc(buffer.subarray(3, 5 + lengthOfData), enhancedEncryption, true);
  buffer[5 + lengthOfData] = (crc >> 8) & 0xff; // crc 1
  buffer[6 + lengthOfData] = crc & 0xff; // crc 2
  buffer[7 + lengthOfData] = 0x5a; // footer 1
  buffer[8 + lengthOfData] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeCheckPassKeyCommand(data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number) {
  const lengthOfData = data?.length || 0;
  const buffer = new Uint8Array(9 + lengthOfData);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02 + lengthOfData; // length
  buffer[3] = 0x01; // command?
  buffer[4] = 0xd0; // check passkey command

  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      buffer[5 + i] = encodePacketPassKeySerialNumber(data[i], deviceName);
    }
  }

  const crc = generateCrc(buffer.subarray(3, 5 + lengthOfData), enhancedEncryption, true);
  buffer[5 + lengthOfData] = (crc >> 8) & 0xff; // crc 1
  buffer[6 + lengthOfData] = crc & 0xff; // crc 2
  buffer[7 + lengthOfData] = 0x5a; // footer 1
  buffer[8 + lengthOfData] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeDefault(operationCode: number, data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number) {
  const lengthOfData = data?.length || 0;
  const buffer = new Uint8Array(9 + lengthOfData);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02 + lengthOfData; // length
  buffer[3] = 0xa1; // command?
  buffer[4] = operationCode; // operation code

  if (data && lengthOfData > 0) {
    for (let i = 0; i < data.length; i++) {
      buffer[5 + i] = data[i];
    }
  }

  const crc = generateCrc(buffer.subarray(3, 5 + lengthOfData), enhancedEncryption, false);
  buffer[5] = (crc >> 8) & 0xff; // crc 1
  buffer[6] = crc & 0xff; // crc 2
  buffer[7] = 0x5a; // footer 1
  buffer[8] = 0x5a; // footer 2

  let encrypted1 = encodePacketSerialNumber(buffer, deviceName);
  if (enhancedEncryption === 0) {
    encrypted1 = encodePacketTime(encrypted1, deviceName.substring(2));
    encrypted1 = encodePacketPassword(encrypted1, deviceName.substring(3));
    encrypted1 = encodePacketPassKey(encrypted1, deviceName.substring(4));
  }

  return encrypted1;
}
