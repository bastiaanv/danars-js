import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBolusGetOption {
	isExtendedBolusEnabled: boolean;
	bolusCalculationOption: number;
	missedBolusConfig: number;
	missedBolus01StartHour: number;
	missedBolus01StartMinute: number;
	missedBolus01EndHour: number;
	missedBolus01EndMinute: number;
	missedBolus02StartHour: number;
	missedBolus02StartMinute: number;
	missedBolus02EndHour: number;
	missedBolus02EndMinute: number;
	missedBolus03StartHour: number;
	missedBolus03StartMinute: number;
	missedBolus03EndHour: number;
	missedBolus03EndMinute: number;
	missedBolus04StartHour: number;
	missedBolus04StartMinute: number;
	missedBolus04EndHour: number;
	missedBolus04EndMinute: number;
}

export function generatePacketBolusGetOption(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_BOLUS_OPTION,
		data: undefined
	};
}

export function parsePacketBolusGetOption(data: Uint8Array): DanaParsePacket<PacketBolusGetOption> {
	const isExtendedBolusEnabled = data[DATA_START] === 1;

	return {
		success: isExtendedBolusEnabled,
		data: {
			isExtendedBolusEnabled,
			bolusCalculationOption: data[DATA_START + 1],
			missedBolusConfig: data[DATA_START + 2],
			missedBolus01StartHour: data[DATA_START + 3],
			missedBolus01StartMinute: data[DATA_START + 4],
			missedBolus01EndHour: data[DATA_START + 5],
			missedBolus01EndMinute: data[DATA_START + 6],
			missedBolus02StartHour: data[DATA_START + 7],
			missedBolus02StartMinute: data[DATA_START + 8],
			missedBolus02EndHour: data[DATA_START + 9],
			missedBolus02EndMinute: data[DATA_START + 10],
			missedBolus03StartHour: data[DATA_START + 11],
			missedBolus03StartMinute: data[DATA_START + 12],
			missedBolus03EndHour: data[DATA_START + 13],
			missedBolus03EndMinute: data[DATA_START + 14],
			missedBolus04StartHour: data[DATA_START + 15],
			missedBolus04StartMinute: data[DATA_START + 16],
			missedBolus04EndHour: data[DATA_START + 17],
			missedBolus04EndMinute: data[DATA_START + 18]
		}
	};
}
