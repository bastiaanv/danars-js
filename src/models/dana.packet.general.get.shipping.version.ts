import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetShippingVersion {
	bleModel: string;
}

export function generatePacketGeneralGetShippingVersion(): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_GENERAL__GET_SHIPPING_VERSION,
		data: undefined
	};
}

export function parsePacketGeneralGetShippingVersion(data: Uint8Array): DanaParsePacket<PacketGeneralGetShippingVersion> {
	return {
		success: true,
		data: {
			bleModel: String.fromCharCode(...data.subarray(DATA_START))
		}
	};
}
