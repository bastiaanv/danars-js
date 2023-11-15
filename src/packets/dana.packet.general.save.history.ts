import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, addDateToPacket } from './dana.packet.base';

export interface PacketGeneralSaveHistory {
  historyType: number;
  historyDate: Date;
  historyCode: number;
  historyValue: number;
}

export const CommandGeneralSaveHistory = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_ETC__SET_HISTORY_SAVE & 0xff);
export function generatePacketGeneralSaveHistory(options: PacketGeneralSaveHistory): DanaGeneratePacket {
  const data = new Uint8Array(10);
  data[0] = options.historyType & 0xff;
  addDateToPacket(data, options.historyDate, 1, false);

  data[7] = options.historyCode & 0xff;
  data[8] = options.historyValue & 0xff;
  data[9] = (options.historyValue >> 8) & 0xff;

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_ETC__SET_HISTORY_SAVE,
    data,
  };
}

export function parsePacketGeneralSaveHistory(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
