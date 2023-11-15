export const DANA_NOTIFY_ALARM = {
  [0x01]: 'Battery 0%',
  [0x02]: 'Pump error',
  [0x03]: 'Occlusion',
  [0x04]: 'Low battery',
  [0x05]: 'Shutdown',
  [0x06]: 'Basal compare',
  [0x07]: 'Blood sugar measurement alert',
  [0xff]: 'Blood sugar measurement alert',
  [0x08]: 'Remaining insulin level',
  [0xfe]: 'Remaining insulin level',
  [0x09]: 'Empty reservoir',
  [0x0a]: 'Check shaft',
  [0x0b]: 'Basal MAX',
  [0x0c]: 'Daily MAX',
  [0xfd]: 'Blood sugar check miss alarm',
} as const;
