import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketBasalCancelTemporary(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BASAL__CANCEL_TEMPORARY_BASAL,
		data: undefined
	};
}

export function parsePacketBasalCancelTemporary(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
