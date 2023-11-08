import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket, addDateToPacket } from './dana.packet.base';

export interface PacketAPSHistoryEvents {
	from: Date | undefined;
	usingUTC: boolean;
}

export function generatePacketAPSHistoryEvents(options: PacketAPSHistoryEvents): DanaGeneratePacket {
	const data = new Uint8Array(6);

	if (!options.from) {
		data[0] = 0;
		data[1] = 1;
		data[2] = 1;
		data[3] = 0;
		data[4] = 0;
		data[5] = 0;
	} else {
		addDateToPacket(data, options.from, 0, options.usingUTC);
	}

	return {
		opCode: DANA_PACKET_TYPE.OPCODE__APS_HISTORY_EVENTS,
		data
	};
}

export function parsePacketAPSHistoryEvents(data: Uint8Array): DanaParsePacket {
	throw new Error('Not implemented');
}
