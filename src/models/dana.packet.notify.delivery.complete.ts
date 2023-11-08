import { DATA_START, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

// Does not need a generate function
export interface PacketNotifyDeliveryComplete {
	deliveredInsulin: number;
}

export function parsePacketNotifyDeliveryComplete(data: Uint8Array): DanaParsePacket<PacketNotifyDeliveryComplete> {
	return {
		success: true,
		data: {
			deliveredInsulin: uint8ArrayToNumber(data, DATA_START, 2) / 100
		}
	};
}
