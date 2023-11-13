import { DATA_START, DanaGeneratePacket, DanaParsePacket, addDateToPacket } from './dana.packet.base';
import { LoopHistoryEvents } from './dana.type.loop.history.events.enum';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface PacketAPSSetEventHistory {
  packetType: number;
  time: Date;
  param1: number;
  param2: number;
  usingUTC: boolean;
}

export const CommandLoopSetEventHistory = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE__APS_SET_EVENT_HISTORY & 0xff);
export function generatePacketLoopSetEventHistory(options: PacketAPSSetEventHistory): DanaGeneratePacket {
  if ((options.packetType == LoopHistoryEvents.CARBS || options.packetType == LoopHistoryEvents.BOLUS) && options.param1 < 0) {
    options.param1 = 0;
  }

  const data = new Uint8Array(11);
  data[0] = options.packetType & 0xff;

  addDateToPacket(data, options.time, 1, options.usingUTC);

  data[7] = (options.param1 >> 8) & 0xff;
  data[8] = options.param1 & 0xff;
  data[9] = (options.param2 >> 8) & 0xff;
  data[10] = options.param2 & 0xff;

  return {
    opCode: DANA_PACKET_TYPE.OPCODE__APS_SET_EVENT_HISTORY,
    data,
  };
}

export function parsePacketLoopSetEventHistory(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
