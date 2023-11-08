import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetPumpTimeUtcWithTimezone {
	time: Date;
}

export function generatePacketGeneralGetPumpTimeUtcWithTimezone(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_OPTION__GET_PUMP_UTC_AND_TIME_ZONE,
		data: undefined
	};
}

export function parsePacketGeneralGetPumpTimeUtcWithTimezone(data: Uint8Array): DanaParsePacket<PacketGeneralGetPumpTimeUtcWithTimezone> {
	const timezoneData = data[DATA_START + 6];
	const timezoneOffset = (timezoneData & 0b01111111) * ((timezoneData & 0b10000000) > 0 ? -1 : 1);

	const time = new Date();
	time.setUTCFullYear(2000 + data[DATA_START], data[DATA_START + 1] - 1, data[DATA_START + 2]);
	time.setUTCHours(data[DATA_START + 3] - timezoneOffset, data[DATA_START + 4], data[DATA_START + 5], 0);

	return {
		success: true,
		data: {
			time
		}
	};
}
