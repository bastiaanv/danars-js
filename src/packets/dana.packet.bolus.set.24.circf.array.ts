import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface PacketBolusSet24CIRCFArray {
  unit: 0 | 1;

  /** Length: 24, value per hour. insulin to carbohydrate ratio */
  ic: number[];

  /** Length: 24, value per hour. insulin sensitivity factor */
  isf: number[];
}

export const CommandBolusSet24CIRCFArray = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_24_CIR_CF_ARRAY & 0xff);
export function generatePacketBolusSet24CIRCFArray(options: PacketBolusSet24CIRCFArray): DanaGeneratePacket {
  if (options.isf.length !== 24 || options.ic.length !== 24) {
    throw new Error('Invalid length isf or ic');
  }

  if (options.unit === 1) {
    options.isf = options.isf.map((x) => x * 100);
  }

  const data = new Uint8Array(96);
  for (let i = 0; i < 24; i++) {
    data[i * 2] = Math.round(options.ic[i]) & 0xff;
    data[i * 2 + 1] = (Math.round(options.ic[i]) >> 8) & 0xff;
    data[i * 2 + 48] = Math.round(options.isf[i]) & 0xff;
    data[i * 2 + 49] = (Math.round(options.isf[i]) >> 8) & 0xff;
  }

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_24_CIR_CF_ARRAY,
    data,
  };
}

export function parsePacketBolusSet24CIRCFArray(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
