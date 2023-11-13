import { DATA_START, DanaParsePacket } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DANA_NOTIFY_ALARM } from './dana.type.notify.alarm.enum';

// Does not need a generate function
export interface PacketNotifyAlarm {
  code: number;
  message: string;
}

export const CommandNotifyAlarm = ((DANA_PACKET_TYPE.TYPE_NOTIFY & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_NOTIFY__ALARM & 0xff);
export function parsePacketNotifyAlarm(data: Uint8Array): DanaParsePacket<PacketNotifyAlarm> {
  return {
    success: true,
    isNotify: true,
    data: {
      code: data[DATA_START],
      message: DANA_NOTIFY_ALARM[data[DATA_START] as keyof typeof DANA_NOTIFY_ALARM] ?? '',
    },
  };
}
