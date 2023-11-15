import { DATA_START, DanaParsePacket } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

// Does not need a generate function
export interface PacketNotifyMissedBolus {
  startTime: Date;
  endTime: Date;
}

export const CommandNotifyMissedBolus = ((DANA_PACKET_TYPE.TYPE_NOTIFY & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_NOTIFY__MISSED_BOLUS_ALARM & 0xff);
export function parsePacketNotifyMissedBolus(data: Uint8Array): DanaParsePacket<PacketNotifyMissedBolus> {
  const startTime = new Date();
  startTime.setHours(data[DATA_START], data[DATA_START + 1], 0, 0);

  const endTime = new Date();
  endTime.setHours(data[DATA_START + 2], data[DATA_START + 3], 0, 0);

  return {
    success: data[DATA_START] !== 0x01 && data[DATA_START + 1] !== 0x01 && data[DATA_START + 2] !== 0x01 && data[DATA_START + 3] !== 0x01,
    notifyType: CommandNotifyMissedBolus,
    data: {
      startTime,
      endTime,
    },
  };
}
