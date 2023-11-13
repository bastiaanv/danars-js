import { DANA_PACKET_TYPE } from './dana.type.message.enum';
import { DATA_START, DanaGeneratePacket, DanaParsePacket, uint8ArrayToNumber } from './dana.packet.base';

export interface PacketGeneralGetInitialScreenInformation {
  isPumpSuspended: boolean;
  isTempBasalInProgress: boolean;
  isExtendedInProgress: boolean;
  isDualBolusInProgress: boolean;

  dailyTotalUnits: number;
  maxDailyTotalUnits: number;
  reservoirRemainingUnits: number;
  currentBasal: number;
  tempBasalPercent: number;
  batteryRemaining: number;
  extendedBolusAbsoluteRemaining: number;
  insulinOnBoard: number;

  /** Only on protocol v10+ */
  errorState: number | undefined;
}

export const CommandGeneralGetInitialScreenInformation =
  ((DANA_PACKET_TYPE.TYPE_RESPONSE & 0xff) << 8) + (DANA_PACKET_TYPE.OPCODE_REVIEW__INITIAL_SCREEN_INFORMATION & 0xff);
export function generatePacketGeneralGetInitialScreenInformation(): DanaGeneratePacket {
  return {
    opCode: DANA_PACKET_TYPE.OPCODE_REVIEW__INITIAL_SCREEN_INFORMATION,
    data: undefined,
  };
}

export function parsePacketGeneralGetInitialScreenInformation(data: Uint8Array): DanaParsePacket<PacketGeneralGetInitialScreenInformation> {
  if (data.length < 17) {
    return {
      success: false,
      data: {
        isPumpSuspended: false,
        isDualBolusInProgress: false,
        isExtendedInProgress: false,
        isTempBasalInProgress: false,
        dailyTotalUnits: -1,
        maxDailyTotalUnits: -1,
        reservoirRemainingUnits: -1,
        currentBasal: -1,
        tempBasalPercent: -1,
        batteryRemaining: -1,
        extendedBolusAbsoluteRemaining: -1,
        insulinOnBoard: -1,
        errorState: undefined,
      },
    };
  }

  const statusPump = data[DATA_START];

  return {
    success: true,
    data: {
      isPumpSuspended: (statusPump & 0x01) === 0x01,
      isExtendedInProgress: (statusPump & 0x04) === 0x04,
      isDualBolusInProgress: (statusPump & 0x08) === 0x08,
      isTempBasalInProgress: (statusPump & 0x10) === 0x10,
      dailyTotalUnits: uint8ArrayToNumber(data, DATA_START + 1, 2) / 100,
      maxDailyTotalUnits: uint8ArrayToNumber(data, DATA_START + 3, 2) / 100,
      reservoirRemainingUnits: uint8ArrayToNumber(data, DATA_START + 5, 2) / 100,
      currentBasal: uint8ArrayToNumber(data, DATA_START + 7, 2) / 100,
      tempBasalPercent: data[DATA_START + 9],
      batteryRemaining: data[DATA_START + 10],
      extendedBolusAbsoluteRemaining: uint8ArrayToNumber(data, DATA_START + 11, 2) / 100,
      insulinOnBoard: uint8ArrayToNumber(data, DATA_START + 13, 2) / 100,
      errorState: data.length > 17 ? data[DATA_START + 15] : undefined,
    },
  };
}
