import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralSetHistoryUploadMode {
  mode: number;
}

export const CommandGeneralSetHistoryUploadMode =
  ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__SET_HISTORY_UPLOAD_MODE & 0xff);
export function generatePacketGeneralSetHistoryUploadMode(options: PacketGeneralSetHistoryUploadMode): DanaGeneratePacket {
  const data = new Uint8Array([options.mode & 0xff]);

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__SET_HISTORY_UPLOAD_MODE,
    data,
  };
}

export function parsePacketGeneralSetHistoryUploadMode(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
