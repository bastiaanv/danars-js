import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketBolusStop(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_STOP,
		data: undefined
	};
}

export function parsePacketBolusStop(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
