import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBasalGetProfileNumber {
	activeProfile: number;
}

export function generatePacketBasalGetProfileNumber(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BASAL__GET_PROFILE_BASAL_RATE,
		data: undefined
	};
}

export function parsePacketBasalGetProfileNumber(data: Uint8Array): DanaParsePacket<PacketBasalGetProfileNumber> {
	return {
		success: true,
		data: {
			activeProfile: data[DATA_START]
		}
	};
}
