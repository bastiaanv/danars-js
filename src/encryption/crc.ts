export function generateCrc(buffer: Uint8Array, enhancedEncryption: number = 0, isEncryptionCommand: boolean) {
  let result = 0;

  for (let i = 0; i < buffer.length; i++) {
    result = buffer[i] ^ ((result >> 8) | (result << 8));
    result = result ^ ((result & 0xff) >> 4);
    result = result ^ (result << 12);

    if (enhancedEncryption === 0 || isEncryptionCommand) {
      result = result ^ (((result & 0xff) << 3) | (((result & 0xff) >> 2) << 5));
    } else if (enhancedEncryption === 1) {
      result = result ^ (((result & 0xff) << 5) | (((result & 0xff) >> 4) << 2));
    } else if (enhancedEncryption === 2) {
      result = result ^ (((result & 0xff) << 4) | (((result & 0xff) >> 3) << 2));
    }
  }

  return result;
}
