import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetPumpTime {
  time: Date;
}

export const CommandGeneralGetPumpTime = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_OPTION__GET_PUMP_TIME & 0xff);
export function generatePacketGeneralGetPumpTime(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_OPTION__GET_PUMP_TIME,
    data: undefined,
  };
}

export function parsePacketGeneralGetPumpTime(data: Uint8Array): DanaParsePacket<PacketGeneralGetPumpTime> {
  const time = new Date();
  time.setFullYear(2000 + data[DATA_START], data[DATA_START + 1] - 1, data[DATA_START + 2]);
  time.setHours(data[DATA_START + 3], data[DATA_START + 4], data[DATA_START + 5], 0);

  return {
    success: true,
    data: {
      time,
    },
  };
}
