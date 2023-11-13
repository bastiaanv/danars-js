import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export const CommandBasalCancelTemporary = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BASAL__CANCEL_TEMPORARY_BASAL & 0xff);
export function generatePacketBasalCancelTemporary(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BASAL__CANCEL_TEMPORARY_BASAL,
    data: undefined,
  };
}

export function parsePacketBasalCancelTemporary(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
