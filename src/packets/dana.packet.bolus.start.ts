import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export type BolusSpeed = 12 | 30 | 60;
export interface PacketBolusStart {
  amount: number;
  speed: BolusSpeed;
}

export const CommandBolusStart = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_START & 0xff);
export function generatePacketBolusStart(options: PacketBolusStart): DanaGeneratePacket {
  options.amount = Math.floor(options.amount * 100);
  const data = new Uint8Array(3);
  data[0] = options.amount & 0xff;
  data[1] = (options.amount >> 8) & 0xff;
  data[2] = options.speed;

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_START,
    data,
  };
}

export function parsePacketBolusStart(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
