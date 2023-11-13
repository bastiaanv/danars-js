import { addDateToPacket } from './dana.packet.base';

export interface PacketHistoryBase {
	from: Date | undefined;
}

export function generatePacketHistoryData(options: PacketHistoryBase): Uint8Array {
	const data = new Uint8Array(6);

	if (!options.from) {
		data[0] = 0;
		data[1] = 1;
		data[2] = 1;
		data[3] = 0;
		data[4] = 0;
		data[5] = 0;
	} else {
		addDateToPacket(data, options.from, 0, false);
	}

	return data;
}
