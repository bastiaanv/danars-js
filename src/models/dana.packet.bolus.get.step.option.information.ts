import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

export interface PacketBolusGetStepInformation {
	bolusType: number;
	initialBolusAmount: number;
	lastBolusTime: Date;
	lastBolusAmount: number;
	maxBolus: number;
	bolusStep: number;
}

export function generatePacketBolusGetStepInformation(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_STEP_BOLUS_INFORMATION,
		data: undefined
	};
}

export function parsePacketBolusGetStepInformation(data: Uint8Array, usingUTC: boolean): DanaParsePacket<PacketBolusGetStepInformation> {
	const lastBolusTime = new Date();
	if (usingUTC) {
		lastBolusTime.setUTCHours(data[DATA_START + 4], data[DATA_START + 5], 0, 0);
	} else {
		lastBolusTime.setHours(data[DATA_START + 4], data[DATA_START + 5], 0, 0);
	}

	return {
		success: data[DATA_START] === 0,
		data: {
			bolusType: data[DATA_START + 1],
			initialBolusAmount: uint8ArrayToNumber(data, DATA_START + 2, 2) / 100,
			lastBolusTime,
			lastBolusAmount: uint8ArrayToNumber(data, DATA_START + 6, 2) / 100,
			maxBolus: uint8ArrayToNumber(data, DATA_START + 8, 2) / 100,
			bolusStep: data[10]
		}
	};
}
