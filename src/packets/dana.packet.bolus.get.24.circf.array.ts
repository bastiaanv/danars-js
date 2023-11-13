import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export const CommandBolusGet24CIRCFArray = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__GET_24_CIR_CF_ARRAY & 0xff);
export function generatePacketBolusGet24CIRCFArray(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_24_CIR_CF_ARRAY,
    data: undefined,
  };
}

export function parsePacketBolusGet24CIRCFArray(data: Uint8Array): DanaParsePacket {
  throw new Error('Not implemented');
}
