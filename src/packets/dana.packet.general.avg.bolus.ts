import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

export interface PacketGeneralAvgBolus {
  bolusAvg03days: number;
  bolusAvg07days: number;
  bolusAvg14days: number;
  bolusAvg21days: number;
  bolusAvg28days: number;
}

export const CommandGeneralAvgBolus = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__BOLUS_AVG & 0xff);
export function generatePacketGeneralAvgBolus(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__BOLUS_AVG,
    data: undefined,
  };
}

export function parsePacketGeneralAvgBolus(data: Uint8Array): DanaParsePacket<PacketGeneralAvgBolus> {
  const checkValue = ((1 & (0x000000ff << 8)) + (1 & 0x000000ff)) / 100;

  const bolusAvg03days = uint8ArrayToNumber(data, DATA_START, 2) / 100;
  const bolusAvg07days = uint8ArrayToNumber(data, DATA_START + 2, 2) / 100;
  const bolusAvg14days = uint8ArrayToNumber(data, DATA_START + 4, 2) / 100;
  const bolusAvg21days = uint8ArrayToNumber(data, DATA_START + 6, 2) / 100;
  const bolusAvg28days = uint8ArrayToNumber(data, DATA_START + 8, 2) / 100;

  return {
    success:
      bolusAvg03days !== checkValue &&
      bolusAvg07days !== checkValue &&
      bolusAvg14days !== checkValue &&
      bolusAvg21days !== checkValue &&
      bolusAvg28days !== checkValue,
    data: {
      bolusAvg03days,
      bolusAvg07days,
      bolusAvg14days,
      bolusAvg21days,
      bolusAvg28days,
    },
  };
}
