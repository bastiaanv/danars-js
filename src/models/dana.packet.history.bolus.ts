import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DanaGeneratePacket } from './dana.packet.base';
import { PacketHistoryBase, generatePacketHistoryData } from './dana.packet.history.base';

export function generatePacketHistoryBolus(options: PacketHistoryBase): DanaGeneratePacket {
	return {
		opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__BOLUS,
		data: generatePacketHistoryData(options)
	};
}
