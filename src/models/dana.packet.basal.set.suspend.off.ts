import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export function generatePacketBasalSetSuspendOff(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_SUSPEND_OFF,
		data: undefined
	};
}

export function parsePacketBasalSetSuspendOff(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
