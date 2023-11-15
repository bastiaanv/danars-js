import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export const CommandGeneralClearUserTimeChangeFlag =
  ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__SET_USER_TIME_CHANGE_FLAG_CLEAR & 0xff);
export function generatePacketGeneralClearUserTimeChangeFlag(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__SET_USER_TIME_CHANGE_FLAG_CLEAR,
    data: undefined,
  };
}

export function parsePacketGeneralClearUserTimeChangeFlag(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
