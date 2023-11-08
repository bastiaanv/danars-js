import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaParsePacket } from './dana.packet.base';

export interface PacketBasalSetProfileNumber {
	profileNumber: number;
}

export function generatePacketBasalSetProfileNumber(options: PacketBasalSetProfileNumber) {
	const data = new Uint8Array([options.profileNumber & 0xff]);

	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_PROFILE_NUMBER,
		data
	};
}

export function parsePacketBasalSetProfileNumber(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
