import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface PacketBolusGet24CIRCFArray {
  unit: 0 | 1;

  /** Length: 24, value per hour. insulin to carbohydrate ratio */
  ic: number[];

  /** Length: 24, value per hour. insulin sensitivity factor  */
  isf: number[];
}

export const CommandBolusGet24CIRCFArray = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__GET_24_CIR_CF_ARRAY & 0xff);
export function generatePacketBolusGet24CIRCFArray(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__GET_24_CIR_CF_ARRAY,
    data: undefined,
  };
}

export function parsePacketBolusGet24CIRCFArray(data: Uint8Array): DanaParsePacket<PacketBolusGet24CIRCFArray> {
  const isf: number[] = [];
  const ic: number[] = [];
  const unit = data[DATA_START] as 0 | 1;

  for (let i = 0; i < 24; i++) {
    ic.push(uint8ArrayToNumber(data, DATA_START + 1 + 2 * i, 2));

    if (unit === 0) {
      isf.push(uint8ArrayToNumber(data, DATA_START + 49 + 2 * i, 2));
    } else {
      isf.push(uint8ArrayToNumber(data, DATA_START + 49 + 2 * i, 2) / 100);
    }
  }

  return {
    success: unit === 0 || unit === 1,
    data: {
      ic,
      isf,
      unit,
    },
  };
}
