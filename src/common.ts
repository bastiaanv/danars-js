export function encodePacketPassKey(buffer: Uint8Array, deviceName: string) {
  for (let i = 0; i < buffer.length - 5; i++) {
    buffer[i + 3] ^= deviceName.charCodeAt((i + 1) % 2);
  }

  return buffer;
}

export function encodePacketPassKeySerialNumber(value: number, deviceName: string) {
  let tmp = 0;
  for (let i = 0; i < 10; i++) {
    tmp += deviceName.charCodeAt(i);
  }

  return value ^ tmp;
}

export function encodePacketPassword(buffer: Uint8Array, deviceName: string) {
  const factor1 = deviceName.charCodeAt(0);
  const factor2 = deviceName.charCodeAt(1);

  for (let i = 3; i < buffer.length - 2; i++) {
    buffer[i] = (buffer[i] ^ factor1) + factor2;
  }

  return buffer;
}

export function encodePacketSerialNumber(buffer: Uint8Array, deviceName: string) {
  const tmp = [
    deviceName.charCodeAt(0) + deviceName.charCodeAt(1) + deviceName.charCodeAt(2),
    deviceName.charCodeAt(3) + deviceName.charCodeAt(4) + deviceName.charCodeAt(5) + deviceName.charCodeAt(6) + deviceName.charCodeAt(7),
    deviceName.charCodeAt(8) + deviceName.charCodeAt(9),
  ];

  for (let i = 0; i < buffer.length - 5; i++) {
    buffer[i + 3] ^= tmp[i % 3];
  }

  return buffer;
}

export function encodePacketTime(buffer: Uint8Array, deviceName: string) {
  let tmp = 0;
  for (let i = 0; i < 6; i++) {
    tmp += deviceName.charCodeAt(i);
  }

  for (let i = 3; i < buffer.length - 2; i++) {
    buffer[i] ^= tmp;
  }

  return buffer;
}

export function encodePairingKey(buffer: Uint8Array) {
  throw new Error('Not implemented error...');
}
