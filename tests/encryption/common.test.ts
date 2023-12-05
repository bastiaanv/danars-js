import { encodePacketSerialNumber } from '../../src/encryption/common';
import { DEVICE_NAME } from '../contants';

describe('Common utils test', () => {
  it('encodePacketSerialNumber should encode packet correctly', () => {
    // pump check command
    const message = new Uint8Array([165, 165, 12, 1, 0, ...DEVICE_NAME.split('').map((_, i) => DEVICE_NAME.charCodeAt(i)), 188, 122, 90, 90]);
    const encodedMessage = encodePacketSerialNumber(message, DEVICE_NAME);

    expect(encodedMessage).toStrictEqual(new Uint8Array([165, 165, 12, 233, 243, 217, 162, 187, 191, 216, 195, 190, 218, 181, 198, 84, 137, 90, 90]));
  });

  // TODO: Need to be validated with older Dana pump
  // it('encodePacketPassKey should encode packet correctly', () => {});

  // TODO: Need to be validated with older Dana pump
  // it('encodePacketTime should encode packet correctly', () => {});

  // TODO: Need to be validated with older Dana pump
  // it('encodePacketPassKeySerialNumber should encode byte correctly', () => {});

  // TODO: Need to be validated with older Dana pump
  // it('encodePacketPassword should encode byte correctly', () => {});

  // TODO: Need to be validated with older Dana pump
  // it('initialRandomSyncKey should encode byte correctly', () => {});

  // TODO: Need to be validated with older Dana pump
  // it('decryptionRandomSyncKey should encode byte correctly', () => {});
});
