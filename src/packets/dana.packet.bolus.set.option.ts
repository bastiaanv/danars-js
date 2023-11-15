import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBolusSetOption {
  extendedBolusOptionOnOff: number;
  bolusCalculationOption: number;
  missedBolusConfig: number;
  missedBolus01StartHour: number;
  missedBolus01StartMin: number;
  missedBolus01EndHour: number;
  missedBolus01EndMin: number;
  missedBolus02StartHour: number;
  missedBolus02StartMin: number;
  missedBolus02EndHour: number;
  missedBolus02EndMin: number;
  missedBolus03StartHour: number;
  missedBolus03StartMin: number;
  missedBolus03EndHour: number;
  missedBolus03EndMin: number;
  missedBolus04StartHour: number;
  missedBolus04StartMin: number;
  missedBolus04EndHour: number;
  missedBolus04EndMin: number;
}

export const CommandBolusSetOption = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_BOLUS_OPTION & 0xff);
export function generatePacketBolusSetOption(options: PacketBolusSetOption): DanaGeneratePacket {
  const data = new Uint8Array(19);
  data[0] = options.extendedBolusOptionOnOff & 0xff;
  data[1] = options.bolusCalculationOption & 0xff;
  data[2] = options.missedBolusConfig & 0xff;
  data[3] = options.missedBolus01StartHour & 0xff;
  data[4] = options.missedBolus01StartMin & 0xff;
  data[5] = options.missedBolus01EndHour & 0xff;
  data[6] = options.missedBolus01EndMin & 0xff;
  data[7] = options.missedBolus02StartHour & 0xff;
  data[8] = options.missedBolus02StartMin & 0xff;
  data[9] = options.missedBolus02EndHour & 0xff;
  data[10] = options.missedBolus02EndMin & 0xff;
  data[11] = options.missedBolus03StartHour & 0xff;
  data[12] = options.missedBolus03StartMin & 0xff;
  data[13] = options.missedBolus03EndHour & 0xff;
  data[14] = options.missedBolus03EndMin & 0xff;
  data[15] = options.missedBolus04StartHour & 0xff;
  data[16] = options.missedBolus04StartMin & 0xff;
  data[17] = options.missedBolus04EndHour & 0xff;
  data[18] = options.missedBolus04EndMin & 0xff;

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_BOLUS_OPTION,
    data,
  };
}

export function parsePacketBolusSetOption(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
