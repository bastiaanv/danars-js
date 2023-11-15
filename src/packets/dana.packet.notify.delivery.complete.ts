import { DATA_START, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

// Does not need a generate function
export interface PacketNotifyDeliveryComplete {
  deliveredInsulin: number;
}

export const CommandNotifyDeliveryComplete = ((DANA_PACKET_TYPE.TYPE_NOTIFY & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_NOTIFY__DELIVERY_COMPLETE & 0xff);
export function parsePacketNotifyDeliveryComplete(data: Uint8Array): DanaParsePacket<PacketNotifyDeliveryComplete> {
  return {
    success: true,
    notifyType: CommandNotifyDeliveryComplete,
    data: {
      deliveredInsulin: uint8ArrayToNumber(data, DATA_START, 2) / 100,
    },
  };
}
