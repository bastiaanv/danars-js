import { DATA_START, DanaParsePacket } from './dana.packet.base';
import { DANA_NOTIFY_ALARM } from './dana.type.notify.alarm.enum';

// Does not need a generate function
export interface PacketNotifyAlarm {
	code: number;
	message: string;
}

export function parsePacketNotifyAlarm(data: Uint8Array): DanaParsePacket<PacketNotifyAlarm> {
	return {
		success: true,
		data: {
			code: data[DATA_START],
			message: DANA_NOTIFY_ALARM[data[DATA_START] as keyof typeof DANA_NOTIFY_ALARM] ?? ''
		}
	};
}
