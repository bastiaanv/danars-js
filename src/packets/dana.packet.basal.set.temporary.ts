import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketBasalSetTemporary {
  temporaryBasalRatio: number;
  temporaryBasalDuration: number;
}

export const CommandBasalSetTemporary = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BASAL__SET_TEMPORARY_BASAL & 0xff);
export function generatePacketBasalSetTemporary(options: PacketBasalSetTemporary): DanaGeneratePacket {
  const data = new Uint8Array([options.temporaryBasalRatio & 0xff, options.temporaryBasalDuration & 0xff]);

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_TEMPORARY_BASAL,
    data,
  };
}

export function parsePacketBasalSetTemporary(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
