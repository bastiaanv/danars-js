import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBolusStart {
	amount: number;
	speed: 12 | 30 | 60;
}

export function generatePacketBolusStart(options: PacketBolusStart): DanaGeneratePacket {
	options.amount = Math.floor(options.amount * 100);
	const data = new Uint8Array(3);
	data[0] = options.amount & 0xff;
	data[1] = (options.amount >> 8) & 0xff;
	data[2] = options.speed;

	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_START,
		data
	};
}

export function parsePacketBolusStart(data: Uint8Array): DanaParsePacket {
	return {
		success: data[DATA_START] === 0,
		data: undefined
	};
}
