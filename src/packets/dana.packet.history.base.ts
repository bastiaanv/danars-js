import { ObjectValues } from '../types';
import { DATA_START, DanaParsePacket, addDateToPacket, uint8ArrayToNumber } from './dana.packet.base';
import { HistoryCode } from './dana.type.history.code';

export interface PacketHistoryBase {
  from: Date | undefined;
}

export interface HistoryItem {
  code: ObjectValues<typeof HistoryCode>;
  timestamp: Date;
  value?: number | undefined;
  durationInMin?: number | undefined;
  dailyBasal?: number | undefined;
  dailyBolus?: number | undefined;
  alarm?: string | undefined;
  bolusType?: ReturnType<typeof getBolusType> | undefined;
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

export function parsePacketHistory(data: Uint8Array): DanaParsePacket<HistoryItem> {
  if (data.length === 3) {
    return {
      success: false,
      data: {
        code: HistoryCode.RECORD_TYPE_UNKNOWN,
        timestamp: new Date(),
        value: data[DATA_START],
      },
    };
  }

  // This packet marks the upload of history to be done
  if (data.length === 5) {
    return {
      success: data[DATA_START] == 0x00,
      data: {
        code: HistoryCode.RECORD_TYPE_DONE_UPLOAD,
        timestamp: new Date(),
        value: data[DATA_START],
      },
    };
  }

  const param7 = data[DATA_START + 6];
  const param8 = data[DATA_START + 7];
  const value = (data[DATA_START + 8] << 8) + data[DATA_START + 9];

  const recordType = data[DATA_START];
  switch (recordType) {
    case HistoryCode.RECORD_TYPE_BOLUS:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_BOLUS,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: value * 0.01,
          bolusType: getBolusType(param8),
          durationInMin: (param8 & 0x0f) * 60 + param7,
        },
      };

    case HistoryCode.RECORD_TYPE_DAILY:
      const dailyBasal = (data[DATA_START + 4] << 8) + data[DATA_START + 5] * 0.01;
      const dailyBolus = (data[DATA_START + 6] << 8) + data[DATA_START + 7] * 0.01;
      const timestamp = uint8ArrayToDate(data, DATA_START + 1);
      timestamp.setHours(0, 0, 0, 0);

      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_DAILY,
          timestamp,
          dailyBasal,
          dailyBolus,
        },
      };

    case HistoryCode.RECORD_TYPE_PRIME:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_PRIME,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: value * 0.01,
        },
      };

    case HistoryCode.RECORD_TYPE_REFILL:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_REFILL,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: value * 0.01,
        },
      };

    case HistoryCode.RECORD_TYPE_BASALHOUR:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_BASALHOUR,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: value * 0.01,
        },
      };

    case HistoryCode.RECORD_TYPE_TEMP_BASAL:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_TEMP_BASAL,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: value * 0.01,
        },
      };

    case HistoryCode.RECORD_TYPE_GLUCOSE:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_GLUCOSE,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value,
        },
      };

    case HistoryCode.RECORD_TYPE_CARBO:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_CARBO,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value,
        },
      };

    case HistoryCode.RECORD_TYPE_SUSPEND:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_SUSPEND,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: param8 === 0x4f ? 1 : 0,
        },
      };

    case HistoryCode.RECORD_TYPE_ALARM:
      return {
        success: true,
        data: {
          code: HistoryCode.RECORD_TYPE_ALARM,
          timestamp: uint8ArrayToDate(data, DATA_START + 1),
          value: value * 0.01,
          alarm: getAlarmMessage(param8),
        },
      };
  }

  return {
    success: false,
    data: {
      code: HistoryCode.RECORD_TYPE_UNKNOWN,
      timestamp: uint8ArrayToDate(data, DATA_START + 1),
      alarm: 'UNKNOWN Message type: ' + recordType,
    },
  };
}

function uint8ArrayToDate(buffer: Uint8Array, startIndex: number) {
  const year = 2000 + buffer[startIndex];
  const month = -1 + buffer[startIndex + 1];
  const day = buffer[startIndex + 2];
  const hour = buffer[startIndex + 3];
  const min = buffer[startIndex + 4];
  const sec = buffer[startIndex + 5];

  return new Date(year, month, day, hour, min, sec, 0);
}

function getBolusType(param8: number) {
  switch (param8 & 0xf0) {
    case 0xa0:
      return 'DS';
    case 0xc0:
      return 'E';
    case 0x80:
      return 'S';
    case 0x90:
      return 'DE';
    default:
      return 'None';
  }
}

function getAlarmMessage(param8: number) {
  switch (param8) {
    case 0x50:
      return 'Basal Compare';
    case 0x52:
      return 'Empty Reservoir';
    case 0x43:
      return 'Check';
    case 0x4f:
      return 'Occlusion';
    case 0x4d:
      return 'Basal max';
    case 0x44:
      return 'Daily max';
    case 0x42:
      return 'Low Battery';
    case 0x53:
      return 'Shutdown';
    default:
      return 'None';
  }
}
