import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface PacketBolusGetStepInformation {
  bolusType: number;
  initialBolusAmount: number;
  lastBolusTime: Date;
  lastBolusAmount: number;
  maxBolus: number;
  bolusStep: number;
}

export const CommandBolusGetStepInformation =
  ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__GET_STEP_BOLUS_INFORMATION & 0xff);
export function generatePacketBolusGetStepInformation(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_STEP_BOLUS_INFORMATION,
    data: undefined,
  };
}

export function parsePacketBolusGetStepInformation(data: Uint8Array): DanaParsePacket<PacketBolusGetStepInformation> {
  const lastBolusTime = new Date();
  lastBolusTime.setHours(data[DATA_START + 4], data[DATA_START + 5], 0, 0);

  return {
    success: data[DATA_START] === 0,
    data: {
      bolusType: data[DATA_START + 1],
      initialBolusAmount: uint8ArrayToNumber(data, DATA_START + 2, 2) / 100,
      lastBolusTime,
      lastBolusAmount: uint8ArrayToNumber(data, DATA_START + 6, 2) / 100,
      maxBolus: uint8ArrayToNumber(data, DATA_START + 8, 2) / 100,
      bolusStep: data[10],
    },
  };
}
