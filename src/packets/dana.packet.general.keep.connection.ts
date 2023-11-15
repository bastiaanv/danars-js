import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export const CommandGeneralKeepConnection = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_ETC__KEEP_CONNECTION & 0xff);
export function generatePacketGeneralKeepConnection(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_ETC__KEEP_CONNECTION,
    data: undefined,
  };
}

export function parsePacketGeneralKeepConnection(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
