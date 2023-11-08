import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketGeneralKeepConnection(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_ETC__KEEP_CONNECTION,
		data: undefined
	};
}

export function parsePacketGeneralKeepConnection(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
