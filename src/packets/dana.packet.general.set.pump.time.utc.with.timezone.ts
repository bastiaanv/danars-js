import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, addDateToPacket } from './dana.packet.base';

export interface PacketGeneralSetPumpTimeUtcWithTimezone {
  time: Date;
  zoneOffset: number;
}

export const CommandGeneralSetPumpTimeUtcWithTimezone =
  ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_OPTION__SET_PUMP_UTC_AND_TIME_ZONE & 0xff);
export function generatePacketGeneralSetPumpTimeUtcWithTimezone(options: PacketGeneralSetPumpTimeUtcWithTimezone): DanaGeneratePacket {
  const data = new Uint8Array(7);
  addDateToPacket(data, options.time, 0, true);
  data[6] = (options.zoneOffset < 0 ? 0b10000000 : 0x0) | (options.zoneOffset & 0x7f);

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_OPTION__SET_PUMP_UTC_AND_TIME_ZONE,
    data,
  };
}

export function parsePacketGeneralSetPumpTimeUtcWithTimezone(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
