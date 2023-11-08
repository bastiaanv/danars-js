import { DATA_START, DanaParsePacket } from './dana.packet.base';

// Does not need a generate function
export interface PacketNotifyMissedBolus {
	startTime: Date;
	endTime: Date;
}

export function parsePacketNotifyMissedBolus(data: Uint8Array): DanaParsePacket<PacketNotifyMissedBolus> {
	const startTime = new Date();
	startTime.setHours(data[DATA_START], data[DATA_START + 1], 0, 0);

	const endTime = new Date();
	endTime.setHours(data[DATA_START + 2], data[DATA_START + 3], 0, 0);

	return {
		success: data[DATA_START] !== 0x01 && data[DATA_START + 1] !== 0x01 && data[DATA_START + 2] !== 0x01 && data[DATA_START + 3] !== 0x01,
		data: {
			startTime,
			endTime
		}
	};
}
