import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export const CommandBolusStop = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_STOP & 0xff);
export function generatePacketBolusStop(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_STOP,
    data: undefined,
  };
}

export function parsePacketBolusStop(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
