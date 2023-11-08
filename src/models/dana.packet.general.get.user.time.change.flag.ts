import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetUserTimeChangeFlag {
	userTimeChangeFlag: number;
}

export function generatePacketGeneralGetUserTimeChangeFlag(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__GET_USER_TIME_CHANGE_FLAG,
		data: undefined
	};
}

export function parsePacketGeneralGetUserTimeChangeFlag(data: Uint8Array): DanaParsePacket<PacketGeneralGetUserTimeChangeFlag> {
	if (data.length < 3) {
		return {
			success: false,
			data: { userTimeChangeFlag: -1 }
		};
	}

	return {
		success: true,
		data: { userTimeChangeFlag: data[DATA_START] }
	};
}
