import { generateCrc } from '../../src/encryption/crc';
import { DEVICE_NAME } from '../contants';

describe('CrC tests', () => {
  it('Should generate correct Crc, enhancedEncryption: 0, isEncryptionCommand: true', () => {
    // pump_check command
    const data = new Uint8Array([1, 0, ...DEVICE_NAME.split('').map((_, i) => DEVICE_NAME.charCodeAt(i))]);
    const crc = generateCrc(data, 0, true);

    expect(crc).toBe(0xbc7a);
  });

  it('Should generate correct crc, enhancedEncryption: 1, isEncryptionCommand: false', () => {
    // BasalSetTemporary command (200%, 1 hour)
    const data = new Uint8Array([161, 96, 200, 1]);
    const crc = generateCrc(data, 1, false);

    expect(crc).toBe(0x33fd);
  });

  it('Should generate correct crc, enhancedEncryption: 1, isEncryptionCommand: true', () => {
    // TIME_INFORMATION command -> sendTimeInfo
    const data = new Uint8Array([1, 1]);
    const crc = generateCrc(data, 1, true);

    expect(crc).toBe(0x0990);
  });

  it('Should generate correct crc, enhancedEncryption: 2, isEncryptionCommand: false', () => {
    // BasalSetTemporary command (200%, 1 hour)
    const data = new Uint8Array([161, 96, 200, 1]);
    const crc = generateCrc(data, 2, false);

    expect(crc).toBe(0x7a1a);
  });

  it('Should generate correct crc, enhancedEncryption: 2, isEncryptionCommand: true', () => {
    // TIME_INFORMATION command -> sendBLE5PairingInformation
    const data = new Uint8Array([1, 1, 0, 0, 0, 0]);
    const crc = generateCrc(data, 2, true);

    expect(crc).toBe(0x1fef);
  });
});
