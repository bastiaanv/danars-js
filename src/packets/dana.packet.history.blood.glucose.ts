import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket } from './dana.packet.base';
import { PacketHistoryBase, generatePacketHistoryData } from './dana.packet.history.base';

export const CommandHistoryBloodGlucose = ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__BLOOD_GLUCOSE & 0xff);
export function generatePacketHistoryBloodGlucose(options: PacketHistoryBase): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__BLOOD_GLUCOSE,
    data: generatePacketHistoryData(options),
  };
}
