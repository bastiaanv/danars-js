import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

export interface PacketBasalGetRate {
  maxBasal: number;
  basalStep: number;

  /** Basal rate per 30 min of active profile. Length: 24 */
  basalProfile: number[];
}

export const CommandBasalGetRate = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BASAL__GET_BASAL_RATE & 0xff);
export function generatePacketBasalGetRate(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BASAL__GET_BASAL_RATE,
    data: undefined,
  };
}

export function parsePacketBasalGetRate(data: Uint8Array): DanaParsePacket<PacketBasalGetRate> {
  const maxBasal = uint8ArrayToNumber(data, DATA_START, 2) / 100;
  const basalStep = data[DATA_START + 2] / 100;

  const basalProfile: number[] = [];
  for (let i = 0; i < 24; i++) {
    basalProfile.push(uint8ArrayToNumber(data, DATA_START + 3 + i * 2, 2) / 100);
  }

  return {
    success: basalStep === 0.01,
    data: {
      maxBasal,
      basalStep,
      basalProfile,
    },
  };
}
