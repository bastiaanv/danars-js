import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket } from './dana.packet.base';
import { PacketHistoryBase, generatePacketHistoryData } from './dana.packet.history.base';

export const CommandHistoryAll = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__ALL_HISTORY & 0xff);
export function generatePacketHistoryAll(options: PacketHistoryBase): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__ALL_HISTORY,
    data: generatePacketHistoryData(options),
  };
}
