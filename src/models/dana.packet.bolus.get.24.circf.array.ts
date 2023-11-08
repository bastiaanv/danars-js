import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketBolusGet24CIRCFArray(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_24_CIR_CF_ARRAY,
		data: undefined
	};
}

export function parsePacketBolusGet24CIRCFArray(data: Uint8Array): DanaParsePacket {
	throw new Error('Not implemented');
}
