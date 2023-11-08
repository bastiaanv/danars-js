import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetPumpDecRatio {
	decRatio: number;
}

export function generatePacketGeneralGetPumpDecRatio(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__GET_PUMP_DEC_RATIO,
		data: undefined
	};
}

export function parsePacketGeneralGetPumpDecRatio(data: Uint8Array): DanaParsePacket<PacketGeneralGetPumpDecRatio> {
	return {
		success: true,
		data: {
			decRatio: data[DATA_START] * 5
		}
	};
}
