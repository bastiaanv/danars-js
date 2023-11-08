import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketBolusCancelExtended(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_EXTENDED_BOLUS_CANCEL,
		data: undefined
	};
}

export function parsePacketBolusCancelExtended(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
