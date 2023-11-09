import { ObjectValues } from '../types';
import type { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface DanaGeneratePacket {
  opCode: ObjectValues<typeof DANA_PACKET_TYPE>;
  data: Uint8Array | undefined;
  type?: number;
}

export interface DanaParsePacket<T = undefined> {
  success: boolean;
  data: T;
}

export const DATA_START = 2;

export function addDateToPacket(buffer: Uint8Array, date: Date, startIndex: number, usingUTC: boolean) {
  if (usingUTC) {
    buffer[startIndex] = date.getUTCFullYear() & 0xff;
    buffer[startIndex + 1] = (date.getUTCMonth() + 1) & 0xff; // Months uses zero-based index in JS
    buffer[startIndex + 2] = date.getUTCDate() & 0xff;
    buffer[startIndex + 3] = date.getUTCHours() & 0xff;
    buffer[startIndex + 4] = date.getUTCMinutes() & 0xff;
    buffer[startIndex + 5] = date.getUTCSeconds() & 0xff;
  } else {
    buffer[startIndex] = date.getFullYear() & 0xff;
    buffer[startIndex + 1] = (date.getMonth() + 1) & 0xff; // Months uses zero-based index in JS
    buffer[startIndex + 2] = date.getDate() & 0xff;
    buffer[startIndex + 3] = date.getHours() & 0xff;
    buffer[startIndex + 4] = date.getMinutes() & 0xff;
    buffer[startIndex + 5] = date.getSeconds() & 0xff;
  }
}

export function uint8ArrayToNumber(buffer: Uint8Array, startIndex: number, length: number) {
  let output = 0;
  for (let i = 0; i < length; i++) {
    output += buffer[startIndex + i] << (8 * i);
  }

  return output;
}
