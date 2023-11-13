import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBolusSetExtended {
  extendedAmount: number;
  extendedDurationInHalfHours: number;
}

export const CommandBolusSetExtended = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_EXTENDED_BOLUS & 0xff);
export function generatePacketBolusSetExtended(options: PacketBolusSetExtended): DanaGeneratePacket {
  const data = new Uint8Array(3);
  data[0] = options.extendedAmount & 0xff;
  data[1] = (options.extendedAmount >> 8) & 0xff;
  data[2] = options.extendedDurationInHalfHours & 0xff;

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_EXTENDED_BOLUS,
    data,
  };
}

export function parsePacketBolusSetExtended(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
