import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBolusGetCIRCFArray {
	language: number;
	units: number;

	// CIR
	morningCIR: number;
	cir02: number;
	afternoonCIR: number;
	cir04: number;
	eveningCIR: number;
	cir06: number;

	// CF
	morningCF: number;
	cf02: number;
	afternoonCF: number;
	cf04: number;
	eveningCF: number;
	cf06: number;
}

export function generatePacketBolusGetCIRCFArray(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_CIR_CF_ARRAY,
		data: undefined
	};
}

export function parsePacketBolusGetCIRCFArray(data: Uint8Array): DanaParsePacket<PacketBolusGetCIRCFArray> {
	throw new Error('Not implemented...');
}
