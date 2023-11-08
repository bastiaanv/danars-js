import { DATA_START, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

// Does not need a generate function
export interface PacketNotifyDeliveryRateDisplay {
	deliveredInsulin: number;
}

export function parsePacketNotifyDeliveryRateDisplay(data: Uint8Array): DanaParsePacket<PacketNotifyDeliveryRateDisplay> {
	return {
		success: true,
		data: {
			deliveredInsulin: uint8ArrayToNumber(data, DATA_START, 2) / 100
		}
	};
}
