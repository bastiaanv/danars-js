import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

export interface PacketBasalSetProfileRate {
  profileNumber: number;

  /** Basal rate per 30 min */
  profileBasalRate: number[];
}

export const CommandBasalSetProfileRate = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BASAL__SET_PROFILE_BASAL_RATE & 0xff);
export function generatePacketBasalSetProfileRate(options: PacketBasalSetProfileRate): DanaGeneratePacket {
  if (options.profileBasalRate.length !== 24) {
    throw new Error('Invalid basal rate. Expected length = 24');
  }

  const data = new Uint8Array(49);
  data[0] = options.profileNumber & 0xff;

  for (let i = 0; i < 24; i++) {
    const rate = options.profileBasalRate[i] * 100;
    data[1 + i * 2] = rate & 0xff;
    data[2 + i * 2] = (rate >> 8) & 0xff;
  }

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BASAL__SET_PROFILE_BASAL_RATE,
    data,
  };
}

export function parsePacketBasalSetProfileRate(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}
