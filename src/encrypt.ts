import { encodePacketPassKeySerialNumber, encodePacketSerialNumber } from './common';
import { generateCrc } from './crc';

export function encrypt(operationCode: number, data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number = 0, unknownValue: number = 0) {
  switch (operationCode) {
    // DANAR_PACKET__OPCODE_ENCRYPTION__PUMP_CHECK
    case 0x00:
      return encodePumpCheckCommand(deviceName, enhancedEncryption, unknownValue);

    // DANAR_PACKET__OPCODE_ENCRYPTION__TIME_INFORMATION
    case 0x01:
      return encodeTimeInformation(data, deviceName, enhancedEncryption, unknownValue);

    // DANAR_PACKET__OPCODE_ENCRYPTION__CHECK_PASSKEY
    case 0xd0:
      return encodeCheckPassKeyCommand(data, deviceName, enhancedEncryption, unknownValue);

    // DANAR_PACKET__OPCODE_ENCRYPTION__PASSKEY_REQUEST
    case 0xd1:
    // DANAR_PACKET__OPCODE_ENCRYPTION__GET_PUMP_CHECK
    case 0xf3:
    // DANAR_PACKET__OPCODE_ENCRYPTION__GET_EASYMENU_CHECK
    case 0xf4:
      return encodeRequestCommand(operationCode, deviceName, enhancedEncryption, unknownValue);

    default:
      return encodeDefault(operationCode, data, deviceName, enhancedEncryption, unknownValue);
  }
}

function encodePumpCheckCommand(deviceName: string, enhancedEncryption: number, unknownValue: number) {
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

  const crc = generateCrc(buffer.subarray(3, 14), enhancedEncryption, unknownValue);
  buffer[15] = (crc >> 8) & 0xff; // crc 1
  buffer[16] = crc & 0xff; // crc 2

  buffer[17] = 0x5a; // footer 1
  buffer[18] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeRequestCommand(operationCode: number, deviceName: string, enhancedEncryption: number, unknownValue: number) {
  const buffer = new Uint8Array(9);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02; // length
  buffer[3] = 0x01; // command?
  buffer[4] = operationCode;

  const crc = generateCrc(buffer.subarray(3, 5), enhancedEncryption, unknownValue);
  buffer[5] = (crc >> 8) & 0xff; // crc 1
  buffer[6] = crc & 0xff; // crc 2
  buffer[7] = 0x5a; // footer 1
  buffer[8] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeTimeInformation(data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number, unknownValue: number) {
  const lengthOfData = data?.length || 0;
  const buffer = new Uint8Array(9 + lengthOfData);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02 + lengthOfData; // length
  buffer[3] = 0x01; // command?
  buffer[4] = 0x01; // time information command

  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      buffer[5 + i] = data[i];
    }
  }

  const crc = generateCrc(buffer.subarray(3, 5 + lengthOfData), enhancedEncryption, unknownValue);
  buffer[5 + lengthOfData] = (crc >> 8) & 0xff; // crc 1
  buffer[6 + lengthOfData] = crc & 0xff; // crc 2
  buffer[7 + lengthOfData] = 0x5a; // footer 1
  buffer[8 + lengthOfData] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeCheckPassKeyCommand(data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number, unknownValue: number) {
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

  const crc = generateCrc(buffer.subarray(3, 5 + lengthOfData), enhancedEncryption, unknownValue);
  buffer[5 + lengthOfData] = (crc >> 8) & 0xff; // crc 1
  buffer[6 + lengthOfData] = crc & 0xff; // crc 2
  buffer[7 + lengthOfData] = 0x5a; // footer 1
  buffer[8 + lengthOfData] = 0x5a; // footer 2

  return encodePacketSerialNumber(buffer, deviceName);
}

function encodeDefault(operationCode: number, data: Uint8Array | undefined, deviceName: string, enhancedEncryption: number, unknownValue: number) {
  const lengthOfData = data?.length || 0;
  const buffer = new Uint8Array(9 + lengthOfData);
  buffer[0] = 0xa5; // header 1
  buffer[1] = 0xa5; // header 2
  buffer[2] = 0x02 + lengthOfData; // length
  buffer[3] = 0xa1; // command?
  buffer[4] = operationCode; // operation code

  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      // TODO:
      // buffer[5 + i] = encodePacketPassKeySerialNumber(data[i], deviceName);
    }
  }

  const crc = generateCrc(buffer.subarray(3, 5 + lengthOfData), enhancedEncryption, unknownValue);
  buffer[5] = (crc >> 8) & 0xff; // crc 1
  buffer[6] = crc & 0xff; // crc 2
  buffer[7] = 0x5a; // footer 1
  buffer[8] = 0x5a; // footer 2

  const encrypted1 = encodePacketSerialNumber(buffer, deviceName);
  if (enhancedEncryption === 0) {
    // TODO:
  }

  return encrypted1;
}
