import { DATA_START, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';
import { DANA_PACKET_TYPE } from './dana.type.message.enum';

// Does not need a generate function
export interface PacketNotifyDeliveryRateDisplay {
  deliveredInsulin: number;
}

export const CommandNotifyDeliveryRateDisplay = ((DANA_PACKET_TYPE.TYPE_NOTIFY & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_NOTIFY__DELIVERY_RATE_DISPLAY & 0xff);
export function parsePacketNotifyDeliveryRateDisplay(data: Uint8Array): DanaParsePacket<PacketNotifyDeliveryRateDisplay> {
  return {
    success: true,
    isNotify: true,
    data: {
      deliveredInsulin: uint8ArrayToNumber(data, DATA_START, 2) / 100,
    },
  };
}
