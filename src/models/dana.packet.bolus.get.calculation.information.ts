import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

export interface PacketBolusGetCalculationInformation {
	currentBg: number;
	carbohydrate: number;
	currentTarget: number;
	currentCIR: number;
	currentCF: number;

	/** 0 = mg/dl, 1 = mmol/L */
	units: 0 | 1;
}

export function generatePacketBolusGetCalculationInformation(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_CALCULATION_INFORMATION,
		data: undefined
	};
}

export function parsePacketBolusGetCalculationInformation(data: Uint8Array): DanaParsePacket<PacketBolusGetCalculationInformation> {
	const currentBg = uint8ArrayToNumber(data, DATA_START + 1, 2);
	const carbohydrate = uint8ArrayToNumber(data, DATA_START + 3, 2);
	const currentTarget = uint8ArrayToNumber(data, DATA_START + 5, 2);
	const currentCIR = uint8ArrayToNumber(data, DATA_START + 7, 2);
	const currentCF = uint8ArrayToNumber(data, DATA_START + 9, 2);
	const units = data[DATA_START + 11] as 0 | 1;

	return {
		success: data[DATA_START] === 0,
		data: {
			currentBg: units === 1 ? currentBg / 100 : currentBg,
			carbohydrate,
			currentTarget: units === 1 ? currentTarget / 100 : currentTarget,
			currentCIR,
			currentCF: units === 1 ? currentCF / 100 : currentCF,
			units
		}
	};
}
