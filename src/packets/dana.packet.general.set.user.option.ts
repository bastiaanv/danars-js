import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralSetUserOption {
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

export const CommandGeneralSetUserOption = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_OPTION__SET_USER_OPTION & 0xff);
export function generatePacketGeneralSetUserOption(options: PacketGeneralSetUserOption): DanaGeneratePacket {
  const data = new Uint8Array(options.targetBg !== undefined ? 15 : 13);
  data[0] = options.isTimeDisplay24H ? 0x01 : 0x00;
  data[1] = options.isButtonScrollOnOff ? 0x01 : 0x00;
  data[2] = options.beepAndAlarm & 0xff;
  data[3] = options.lcdOnTimeInSec & 0xff;
  data[4] = options.backlightOnTimInSec & 0xff;
  data[5] = options.selectedLanguage & 0xff;
  data[6] = options.units & 0xff;
  data[7] = options.shutdownHour & 0xff;
  data[8] = options.lowReservoirRate & 0xff;
  data[9] = options.cannulaVolume & 0xff;
  data[10] = (options.cannulaVolume >> 8) & 0xff;
  data[11] = options.refillAmount & 0xff;
  data[12] = (options.refillAmount >> 8) & 0xff;

  if (options.targetBg !== undefined) {
    data[13] = options.targetBg & 0xff;
    data[14] = (options.targetBg >> 8) & 0xff;
  }

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_OPTION__SET_USER_OPTION,
    data,
  };
}

export function parsePacketGeneralSetUserOption(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
