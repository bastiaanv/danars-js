import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket } from './dana.packet.base';

export interface PacketGeneralGetShippingInformation {
  serialNumber: string;
  shippingCountry: string;
  shippingDate: Date;
}

export const CommandGeneralGetShippingInformation =
  ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__GET_SHIPPING_INFORMATION & 0xff);
export function generatePacketGeneralGetShippingInformation(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__GET_SHIPPING_INFORMATION,
    data: undefined,
  };
}

export function parsePacketGeneralGetShippingInformation(data: Uint8Array): DanaParsePacket<PacketGeneralGetShippingInformation> {
  if (data.length < 18) {
    return {
      success: false,
      data: {
        serialNumber: '',
        shippingCountry: '',
        shippingDate: new Date(),
      },
    };
  }

  const serialNumber = String.fromCharCode(...data.subarray(DATA_START, DATA_START + 10));
  const shippingCountry = String.fromCharCode(...data.subarray(DATA_START + 10, DATA_START + 13));

  const shippingDate = new Date();
  shippingDate.setFullYear(2000 + data[DATA_START + 13], data[DATA_START + 14] - 1, data[DATA_START + 15]);
  shippingDate.setHours(0, 0, 0, 0);

  return {
    success: true,
    data: {
      serialNumber,
      shippingCountry,
      shippingDate,
    },
  };
}
