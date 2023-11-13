import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketLoopSetTemporaryBasal {
  percent: number;
}

export const CommandLoopSetTemporaryBasal = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_BASAL__APS_SET_TEMPORARY_BASAL & 0xff);
export function generatePacketLoopSetTemporaryBasal(options: PacketLoopSetTemporaryBasal): DanaGeneratePacket {
  if (options.percent < 0) {
    options.percent = 0;
  } else if (options.percent > 500) {
    options.percent = 500;
  }

  const data = new Uint8Array([
    options.percent & 0xff,
    (options.percent >> 8) & 0xff,
    (options.percent < 100 ? temporaryBasalDuration.PARAM_30_MIN : temporaryBasalDuration.PARAM_15_MIN) & 0xff,
  ]);

  return {
    opCode: DANA_PACKET_TYPE.OPCODE_BASAL__APS_SET_TEMPORARY_BASAL,
    data,
  };
}

export function parsePacketLoopSetTemporaryBasal(data: Uint8Array): DanaParsePacket {
  return {
    success: data[DATA_START] === 0,
    data: undefined,
  };
}

const temporaryBasalDuration = {
  PARAM_30_MIN: 160,
  PARAM_15_MIN: 150,
};
