import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBasalSetTemporary {
	temporaryBasalRatio: number;
	temporaryBasalDuration: number;
}

export function generatePacketBasalSetTemporary(options: PacketBasalSetTemporary): DanaGeneratePacket {
	const data = new Uint8Array([options.temporaryBasalRatio & 0xff, options.temporaryBasalDuration & 0xff]);

	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_TEMPORARY_BASAL,
		data
	};
}

export function parsePacketBasalSetTemporary(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
