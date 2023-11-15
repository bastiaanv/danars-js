import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface PacketBolusGetCIRCFArray {
  language: number;
  unit: number;

  // CIR
  morningCIR: number;
  cir02: number;
  afternoonCIR: number;
  cir04: number;
  eveningCIR: number;
  cir06: number;
  nightCIR: number;

  // CF
  morningCF: number;
  cf02: number;
  afternoonCF: number;
  cf04: number;
  eveningCF: number;
  cf06: number;
  nightCF: number;
}

export const CommandBolusGetCIRCFArray = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__GET_CIR_CF_ARRAY & 0xff);
export function generatePacketBolusGetCIRCFArray(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_CIR_CF_ARRAY,
    data: undefined,
  };
}

export function parsePacketBolusGetCIRCFArray(data: Uint8Array): DanaParsePacket<PacketBolusGetCIRCFArray> {
  const language = data[DATA_START];
  const unit = data[DATA_START + 1] as 0 | 1;
  const morningCIR = uint8ArrayToNumber(data, DATA_START + 2, 2);
  const cir02 = uint8ArrayToNumber(data, DATA_START + 4, 2);
  const afternoonCIR = uint8ArrayToNumber(data, DATA_START + 6, 2);
  const cir04 = uint8ArrayToNumber(data, DATA_START + 8, 2);
  const eveningCIR = uint8ArrayToNumber(data, DATA_START + 10, 2);
  const cir06 = uint8ArrayToNumber(data, DATA_START + 12, 2);
  const nightCIR = uint8ArrayToNumber(data, DATA_START + 14, 2);

  const divisionFactor = unit === 1 ? 100 : 1;
  const morningCF = uint8ArrayToNumber(data, DATA_START + 16, 2) / divisionFactor;
  const cf02 = uint8ArrayToNumber(data, DATA_START + 18, 2) / divisionFactor;
  const afternoonCF = uint8ArrayToNumber(data, DATA_START + 20, 2) / divisionFactor;
  const cf04 = uint8ArrayToNumber(data, DATA_START + 22, 2) / divisionFactor;
  const eveningCF = uint8ArrayToNumber(data, DATA_START + 24, 2) / divisionFactor;
  const cf06 = uint8ArrayToNumber(data, DATA_START + 26, 2) / divisionFactor;
  const nightCF = uint8ArrayToNumber(data, DATA_START + 28, 2) / divisionFactor;

  return {
    success: unit === 0 || unit === 1,
    data: {
      language,
      unit,
      morningCF,
      cf02,
      afternoonCF,
      cf04,
      eveningCF,
      cf06,
      nightCF,
      morningCIR,
      cir02,
      afternoonCIR,
      cir04,
      eveningCIR,
      cir06,
      nightCIR,
    },
  };
}
