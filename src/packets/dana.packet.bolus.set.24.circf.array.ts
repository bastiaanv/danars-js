import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBolusSet24CIRCFArray {}

export const CommandBolusSet24CIRCFArray = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_24_CIR_CF_ARRAY & 0xff);
export function generatePacketBolusSet24CIRCFArray(options: PacketBolusSet24CIRCFArray): DanaGeneratePacket {
  throw new Error('Not supported (yet)');
  // const data = new Uint8Array(96);

  // return {
  // 	opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_24_CIR_CF_ARRAY,
  // 	data
  // };
}

export function parsePacketBolusSet24CIRCFArray(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
