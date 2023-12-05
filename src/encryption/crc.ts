export function generateCrc(buffer: Uint8Array, enhancedEncryption: number, isEncryptionCommand: boolean) {
  let crc = 0;

  for (let i = 0; i < buffer.length; i++) {
    let result = toUint16(((crc >> 8) | (crc << 8)) ^ buffer[i]);
    result = result ^ ((result & 0xff) >> 4);
    result = toUint16(result ^ (result << 12));

    if (enhancedEncryption === 0) {
      const tmp = toUint16((result & 0xff) << 3) | toUint16(((result & 0xff) >> 2) << 5);
      result = result ^ tmp;
    } else if (enhancedEncryption === 1) {
      let tmp = 0;
      if (isEncryptionCommand) {
        tmp = toUint16((result & 0xff) << 3) | toUint16(((result & 0xff) >> 2) << 5);
      } else {
        tmp = toUint16((result & 0xff) << 5) | toUint16(((result & 0xff) >> 4) << 2);
      }
      result = result ^ tmp;
    } else if (enhancedEncryption === 2) {
      let tmp = 0;
      if (isEncryptionCommand) {
        tmp = toUint16((result & 0xff) << 3) | toUint16(((result & 0xff) >> 2) << 5);
      } else {
        tmp = toUint16((result & 0xff) << 4) | toUint16(((result & 0xff) >> 3) << 2);
      }
      result = result ^ tmp;
    }

    crc = result;
  }

  return crc;
}

function toUint16(value: number) {
  return value & 0xffff;
}
