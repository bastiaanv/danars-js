import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, addDateToPacket } from './dana.packet.base';

export interface PacketGeneralSetPumpTime {
  time: Date;
}

export const CommandGeneralSetPumpTime = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_OPTION__SET_PUMP_TIME & 0xff);
export function generatePacketGeneralSetPumpTime(options: PacketGeneralSetPumpTime): DanaGeneratePacket {
  const data = new Uint8Array(6);
  addDateToPacket(data, options.time, 0, false);

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_OPTION__SET_PUMP_TIME,
    data,
  };
}

export function parsePacketGeneralSetPumpTime(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
