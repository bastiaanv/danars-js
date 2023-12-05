// exec_get_enc_packet_passkey(char*, int, char*)
export function encodePacketPassKey(buffer: Uint8Array, passkeySecret: number[]) {
  for (let i = 0; i < buffer.length - 5; i++) {
    buffer[i + 3] ^= passkeySecret[(i + 1) % 2];
  }

  return buffer;
}

// exec_get_enc_passkey_sn(byte, char*)
export function encodePacketPassKeySerialNumber(value: number, deviceName: string) {
  let tmp = 0;
  for (let i = 0; i < 10; i++) {
    tmp += deviceName.charCodeAt(i);
    tmp &= 0xff;
  }

  return value ^ tmp;
}

// exec_get_enc_packet_password
export function encodePacketPassword(buffer: Uint8Array, passwordSecret: number[]) {
  const tmp = passwordSecret[0] + passwordSecret[1];
  for (let i = 3; i < buffer.length - 2; i++) {
    buffer[i] = buffer[i] ^ tmp;
  }

  return buffer;
}

// exec_get_enc_packet_sn(char*, int, char*)
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

// exec_get_enc_packet_time(char*, int, char*)
export function encodePacketTime(buffer: Uint8Array, timeSecret: number[]) {
  const tmp = timeSecret.reduce((a, b) => a + b, 0);
  for (let i = 3; i < buffer.length - 2; i++) {
    buffer[i] ^= tmp;
  }

  return buffer;
}

// exec_get_enc_pairingkey(int, int)
export function encodePairingKey(buffer: Uint8Array, pairingKey: number[], global_random_sync_key: number) {
  let new_random_sync_key = global_random_sync_key;

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] ^= pairingKey[0];
    buffer[i] -= new_random_sync_key;
    buffer[i] = ((buffer[i] >> 4) & 0xf) | ((buffer[i] & 0xf) << 4);

    buffer[i] += pairingKey[1];
    buffer[i] ^= pairingKey[2];
    buffer[i] = ((buffer[i] >> 4) & 0xf) | ((buffer[i] & 0xf) << 4);

    buffer[i] -= pairingKey[3];
    buffer[i] ^= pairingKey[4];
    buffer[i] = ((buffer[i] >> 4) & 0xf) | ((buffer[i] & 0xf) << 4);

    buffer[i] ^= pairingKey[5];
    buffer[i] ^= new_random_sync_key;

    new_random_sync_key = buffer[i];
  }

  // set global random sync key to new_random_sync_key..
  return { global_random_sync_key: new_random_sync_key, buffer };
}

// exec_get_desc_pairingkey(char*, int)
export function getDescPairingKey(buffer: Uint8Array, pairingKey: number[], global_random_sync_key: number) {
  // This is the reverse of encodePairingKey
  let new_random_sync_key = global_random_sync_key;

  for (let i = 0; i < buffer.length; i++) {
    const tmp = buffer[i];

    buffer[i] ^= new_random_sync_key;
    buffer[i] ^= pairingKey[5];

    buffer[i] = ((buffer[i] >> 4) & 0xf) | ((buffer[i] & 0xf) << 4);
    buffer[i] ^= pairingKey[4];
    buffer[i] -= pairingKey[3];

    buffer[i] = ((buffer[i] >> 4) & 0xf) | ((buffer[i] & 0xf) << 4);
    buffer[i] ^= pairingKey[2];
    buffer[i] += pairingKey[1];
    buffer[i] ^= pairingKey[0];

    buffer[i] = ((buffer[i] >> 4) & 0xf) | ((buffer[i] & 0xf) << 4);
    buffer[i] -= new_random_sync_key;

    // set global random sync key to new_random_sync_key..
    new_random_sync_key = tmp;
  }

  return { global_random_sync_key: new_random_sync_key, buffer };
}

export function encryptionRandomSyncKey(randomSyncKey: number, randomPairingKey: number[]) {
  let tmp = 0;

  tmp = ((randomSyncKey >> 4) | ((randomSyncKey & 0xf) << 4)) + randomPairingKey[0];
  tmp = ((tmp >> 4) | ((tmp & 0xf) << 4)) ^ randomPairingKey[1];

  return ((tmp >> 4) | ((tmp & 0xf) << 4)) - randomPairingKey[2];
}

export function decryptionRandomSyncKey(randomSyncKey: number, randomPairingKey: number[]) {
  let tmp = 0;

  tmp = ((randomSyncKey + randomPairingKey[2]) >> 4) | ((((randomSyncKey + randomPairingKey[2]) & 0xf) << 4) ^ randomPairingKey[1]);
  tmp = ((tmp >> 4) | ((tmp & 0xf) << 4)) - randomPairingKey[0];

  return (tmp >> 4) | ((tmp & 0xf) << 4);
}

export function initialRandomSyncKey(pairingKey: number[]) {
  let tmp = 0;

  tmp = ((pairingKey[0] + pairingKey[1]) >> 4) | (((((pairingKey[0] + pairingKey[1]) & 0xf) << 4) ^ pairingKey[2]) - pairingKey[3]);
  tmp = ((tmp >> 4) | ((tmp & 0xf) << 4)) ^ pairingKey[4];

  return ((tmp >> 4) | ((tmp & 0xf) << 4)) ^ pairingKey[5];
}
