import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

export interface PacketGeneralGetUserOption {
	isTimeDisplay24H: boolean;
	isButtonScrollOnOff: boolean;
	beepAndAlarm: number;
	lcdOnTimeInSec: number;
	backlightOnTimInSec: number;
	selectedLanguage: number;
	units: 0 | 1;
	shutdownHour: number;
	lowReservoirRate: number;
	cannulaVolume: number;
	refillAmount: number;

	selectableLanguage1: number;
	selectableLanguage2: number;
	selectableLanguage3: number;
	selectableLanguage4: number;
	selectableLanguage5: number;

	/** Only on hw v7+ */
	targetBg: number | undefined;
}

export function generatePacketGeneralGetUserOption(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_OPTION__GET_USER_OPTION,
		data: undefined
	};
}

export function parsePacketGeneralGetUserOption(data: Uint8Array): DanaParsePacket<PacketGeneralGetUserOption> {
	return {
		success: data[DATA_START + 3] >= 5, // Pump's screen on time can't be less than 5
		data: {
			isTimeDisplay24H: data[DATA_START + 0] == 0,
			isButtonScrollOnOff: data[DATA_START + 1] == 1,
			beepAndAlarm: data[DATA_START + 2],
			lcdOnTimeInSec: data[DATA_START + 3],
			backlightOnTimInSec: data[DATA_START + 4],
			selectedLanguage: data[DATA_START + 5],
			units: data[DATA_START + 6] as 0 | 1,
			shutdownHour: data[DATA_START + 7],
			lowReservoirRate: data[DATA_START + 8],
			cannulaVolume: uint8ArrayToNumber(data, DATA_START + 9, 2),
			refillAmount: uint8ArrayToNumber(data, DATA_START + 11, 2),
			selectableLanguage1: data[DATA_START + 13],
			selectableLanguage2: data[DATA_START + 14],
			selectableLanguage3: data[DATA_START + 15],
			selectableLanguage4: data[DATA_START + 16],
			selectableLanguage5: data[DATA_START + 17],
			targetBg: data.length > 22 ? (uint8ArrayToNumber(data, DATA_START + 18, 2) / data[DATA_START + 6] === 6 ? 100 : 1) : undefined
		}
	};
}
