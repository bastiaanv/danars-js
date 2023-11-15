import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export const CommandBasalSetSuspendOn = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BASAL__SET_SUSPEND_ON & 0xff);
export function generatePacketBasalSetSuspendOn(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_SUSPEND_ON,
    data: undefined,
  };
}

export function parsePacketBasalSetSuspendOn(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
