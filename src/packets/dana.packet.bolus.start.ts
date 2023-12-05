import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export type BolusSpeed = 12 | 30 | 60;
export interface PacketBolusStart {
  amount: number;
  speed: BolusSpeed;
}

export const CommandBolusStart = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_START & 0xff);
export function generatePacketBolusStart(options: PacketBolusStart): DanaGeneratePacket {
  const bolusRate = Math.floor(options.amount * 100);
  const data = new Uint8Array(3);
  data[0] = bolusRate & 0xff;
  data[1] = (bolusRate >> 8) & 0xff;
  data[2] = speedToOrdinal(options.speed);

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BOLUS__SET_STEP_BOLUS_START,
    data,
  };
}

function speedToOrdinal(speed: BolusSpeed) {
  if (speed === 12) {
    return 0;
  } else if (speed === 30) {
    return 1;
  } else if (speed === 60) {
    return 2;
  } else {
    throw new Error('Invalid bolus speed');
  }
}

/**
 * Error codes:
 * 0x04 => Bolus timeout active
 * 0x10 => Max bolus violation
 * 0x20 => Command error
 * 0x40 => Speed error
 * 0x80 => Insulin limit violation
 */
export function parsePacketBolusStart(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
