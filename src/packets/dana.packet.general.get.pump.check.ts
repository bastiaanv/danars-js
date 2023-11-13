import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetPumpCheck {
  hwModel: number;
  protocol: number;
  productCode: number;
}

export const CommandGeneralGetPumpCheck = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__GET_PUMP_CHECK & 0xff);
export function generatePacketGeneralGetPumpCheck(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__GET_PUMP_CHECK,
    data: undefined,
  };
}

export function parsePacketGeneralGetPumpCheck(data: Uint8Array): DanaParsePacket<PacketGeneralGetPumpCheck> {
  return {
    success: data[4] < 4, // Unsupported hardware...
    data: {
      hwModel: data[DATA_START],
      protocol: data[DATA_START + 1],
      productCode: data[DATA_START + 2],
    },
  };
}
