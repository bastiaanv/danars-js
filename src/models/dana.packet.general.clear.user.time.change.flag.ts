import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketGeneralClearUserTimeChangeFlag(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__SET_USER_TIME_CHANGE_FLAG_CLEAR,
		data: undefined
	};
}

export function parsePacketGeneralClearUserTimeChangeFlag(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
