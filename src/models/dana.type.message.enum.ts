export const DANA_PACKET_TYPE = {
  TYPE_ENCRYPTION_REQUEST: 0x01,
  TYPE_ENCRYPTION_RESPONSE: 0x02,
  TYPE_COMMAND: 0xa1,
  TYPE_RESPONSE: 0xb2,
  TYPE_NOTIFY: 0xc3,

  OPCODE_ENCRYPTION__PUMP_CHECK: 0x00,
  OPCODE_ENCRYPTION__TIME_INFORMATION: 0x01,
  OPCODE_ENCRYPTION__CHECK_PASSKEY: 0xd0,
  OPCODE_ENCRYPTION__PASSKEY_REQUEST: 0xd1,
  OPCODE_ENCRYPTION__PASSKEY_RETURN: 0xd2,
  OPCODE_ENCRYPTION__GET_PUMP_CHECK: 0xf3,
  OPCODE_ENCRYPTION__GET_EASYMENU_CHECK: 0xf4,
  OPCODE_NOTIFY__DELIVERY_COMPLETE: 0x01,
  OPCODE_NOTIFY__DELIVERY_RATE_DISPLAY: 0x02,
  OPCODE_NOTIFY__ALARM: 0x03,
  OPCODE_NOTIFY__MISSED_BOLUS_ALARM: 0x04,
  OPCODE_REVIEW__INITIAL_SCREEN_INFORMATION: 0x02,
  OPCODE_REVIEW__DELIVERY_STATUS: 0x03,
  OPCODE_REVIEW__GET_PASSWORD: 0x04,
  OPCODE_REVIEW__BOLUS_AVG: 0x10,
  OPCODE_REVIEW__BOLUS: 0x11,
  OPCODE_REVIEW__DAILY: 0x12,
  OPCODE_REVIEW__PRIME: 0x13,
  OPCODE_REVIEW__REFILL: 0x14,
  OPCODE_REVIEW__BLOOD_GLUCOSE: 0x15,
  OPCODE_REVIEW__CARBOHYDRATE: 0x16,
  OPCODE_REVIEW__TEMPORARY: 0x17,
  OPCODE_REVIEW__SUSPEND: 0x18,
  OPCODE_REVIEW__ALARM: 0x19,
  OPCODE_REVIEW__BASAL: 0x1a,
  OPCODE_REVIEW__ALL_HISTORY: 0x1f,
  OPCODE_REVIEW__GET_SHIPPING_INFORMATION: 0x20,
  OPCODE_REVIEW__GET_PUMP_CHECK: 0x21,
  OPCODE_REVIEW__GET_USER_TIME_CHANGE_FLAG: 0x22,
  OPCODE_REVIEW__SET_USER_TIME_CHANGE_FLAG_CLEAR: 0x23,
  OPCODE_REVIEW__GET_MORE_INFORMATION: 0x24,
  OPCODE_REVIEW__SET_HISTORY_UPLOAD_MODE: 0x25,
  OPCODE_REVIEW__GET_TODAY_DELIVERY_TOTAL: 0x26,
  OPCODE_BOLUS__GET_STEP_BOLUS_INFORMATION: 0x40,
  OPCODE_BOLUS__GET_EXTENDED_BOLUS_STATE: 0x41,
  OPCODE_BOLUS__GET_EXTENDED_BOLUS: 0x42,
  OPCODE_BOLUS__GET_DUAL_BOLUS: 0x43,
  OPCODE_BOLUS__SET_STEP_BOLUS_STOP: 0x44,
  OPCODE_BOLUS__GET_CARBOHYDRATE_CALCULATION_INFORMATION: 0x45,
  OPCODE_BOLUS__GET_EXTENDED_MENU_OPTION_STATE: 0x46,
  OPCODE_BOLUS__SET_EXTENDED_BOLUS: 0x47,
  OPCODE_BOLUS__SET_DUAL_BOLUS: 0x48,
  OPCODE_BOLUS__SET_EXTENDED_BOLUS_CANCEL: 0x49,
  OPCODE_BOLUS__SET_STEP_BOLUS_START: 0x4a,
  OPCODE_BOLUS__GET_CALCULATION_INFORMATION: 0x4b,
  OPCODE_BOLUS__GET_BOLUS_RATE: 0x4c,
  OPCODE_BOLUS__SET_BOLUS_RATE: 0x4d,
  OPCODE_BOLUS__GET_CIR_CF_ARRAY: 0x4e,
  OPCODE_BOLUS__SET_CIR_CF_ARRAY: 0x4f,
  OPCODE_BOLUS__GET_BOLUS_OPTION: 0x50,
  OPCODE_BOLUS__SET_BOLUS_OPTION: 0x51,
  OPCODE_BOLUS__GET_24_CIR_CF_ARRAY: 0x52,
  OPCODE_BOLUS__SET_24_CIR_CF_ARRAY: 0x53,
  OPCODE_BASAL__SET_TEMPORARY_BASAL: 0x60,
  OPCODE_BASAL__TEMPORARY_BASAL_STATE: 0x61,
  OPCODE_BASAL__CANCEL_TEMPORARY_BASAL: 0x62,
  OPCODE_BASAL__GET_PROFILE_NUMBER: 0x63,
  OPCODE_BASAL__SET_PROFILE_NUMBER: 0x64,
  OPCODE_BASAL__GET_PROFILE_BASAL_RATE: 0x65,
  OPCODE_BASAL__SET_PROFILE_BASAL_RATE: 0x66,
  OPCODE_BASAL__GET_BASAL_RATE: 0x67,
  OPCODE_BASAL__SET_BASAL_RATE: 0x68,
  OPCODE_BASAL__SET_SUSPEND_ON: 0x69,
  OPCODE_BASAL__SET_SUSPEND_OFF: 0x6a,
  OPCODE_OPTION__GET_PUMP_TIME: 0x70,
  OPCODE_OPTION__SET_PUMP_TIME: 0x71,
  OPCODE_OPTION__GET_USER_OPTION: 0x72,
  OPCODE_OPTION__SET_USER_OPTION: 0x73,
  OPCODE_BASAL__APS_SET_TEMPORARY_BASAL: 0xc1,
  OPCODE__APS_HISTORY_EVENTS: 0xc2,
  OPCODE__APS_SET_EVENT_HISTORY: 0xc3,
  OPCODE_REVIEW__GET_PUMP_DEC_RATIO: 0x80,
  OPCODE_GENERAL__GET_SHIPPING_VERSION: 0x81,
  OPCODE_OPTION__GET_EASY_MENU_OPTION: 0x74,
  OPCODE_OPTION__SET_EASY_MENU_OPTION: 0x75,
  OPCODE_OPTION__GET_EASY_MENU_STATUS: 0x76,
  OPCODE_OPTION__SET_EASY_MENU_STATUS: 0x77,
  OPCODE_OPTION__GET_PUMP_UTC_AND_TIME_ZONE: 0x78,
  OPCODE_OPTION__SET_PUMP_UTC_AND_TIME_ZONE: 0x79,
  OPCODE_OPTION__GET_PUMP_TIME_ZONE: 0x7a,
  OPCODE_OPTION__SET_PUMP_TIME_ZONE: 0x7b,
  OPCODE_ETC__SET_HISTORY_SAVE: 0xe0,
  OPCODE_ETC__KEEP_CONNECTION: 0xff,
} as const;
