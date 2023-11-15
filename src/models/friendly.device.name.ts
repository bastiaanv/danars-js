export function getFriendlyDeviceName(hwModel: number, protocol: number) {
  switch (hwModel) {
    case 0x01:
      return 'DanaR Korean';

    case 0x03:
      switch (protocol) {
        case -1:
          return 'Unknown Dana pump (hwModel 0x03, protocol: -1)';
        case 0x00:
          return 'DanaR old';
        case 0x02:
          return 'DanaR v2';
        default:
          return 'DanaR'; // 0x01 and 0x03 known
      }

    case 0x05:
      return protocol < 10 ? 'DanaRS' : 'DanaRS v3';

    case 0x06:
      return 'DanaRS Korean';

    case 0x07:
      return 'Dana-i (BLE4.2)';

    case 0x09:
      return 'Dana-i (BLE5)';
    case 0x0a:
      return 'Dana-i (BLE5, Korean)';
    default:
      return `Unknown Dana pump (hxModel ${hwModel})`;
  }
}
