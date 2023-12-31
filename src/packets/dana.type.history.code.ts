export const HistoryCode = {
  RECORD_TYPE_DONE_UPLOAD: -0x01,
  RECORD_TYPE_UNKNOWN: 0x00,
  RECORD_TYPE_BOLUS: 0x02,
  RECORD_TYPE_DAILY: 0x03,
  RECORD_TYPE_PRIME: 0x04,
  RECORD_TYPE_REFILL: 0x05,
  RECORD_TYPE_GLUCOSE: 0x06,
  RECORD_TYPE_CARBO: 0x07,
  RECORD_TYPE_SUSPEND: 0x09,
  RECORD_TYPE_ALARM: 0x0a,
  RECORD_TYPE_BASALHOUR: 0x0b,
  RECORD_TYPE_TEMP_BASAL: 0x99,
} as const;
