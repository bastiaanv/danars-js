import { Preferences } from '@capacitor/preferences';

const RANDOM_PAIRING_KEY_KEY = 'DanaRS_Random_Pairing_Key';
const PAIRING_KEY_KEY = 'DanaRS_Pairing_Key';
const RANDOM_SYNC_KEY_KEY = 'DanaRS_Random_Sync_Key';
const BLE_5_KEY_KEY = 'DanaRS_Ble_5_Key';

export class StorageService {
  // Pairing key
  public static async getPairingKey(): Promise<number[] | undefined> {
    const { value } = await Preferences.get({ key: PAIRING_KEY_KEY });
    return value ? JSON.parse(value) : undefined;
  }

  public static async setPairingKey(value: number[]) {
    await Preferences.set({ key: PAIRING_KEY_KEY, value: JSON.stringify(value) });
  }

  // Random pairing key
  public static async getRandomPairingKey(): Promise<number[] | undefined> {
    const { value } = await Preferences.get({ key: RANDOM_PAIRING_KEY_KEY });
    return value ? JSON.parse(value) : undefined;
  }

  public static async setRandomPairingKey(value: number[]) {
    await Preferences.set({ key: RANDOM_PAIRING_KEY_KEY, value: JSON.stringify(value) });
  }

  // Random sync key
  public static async getRandomSyncKey(): Promise<number | undefined> {
    const { value } = await Preferences.get({ key: RANDOM_SYNC_KEY_KEY });
    return value ? parseInt(value) : 0;
  }

  public static async setRandomSyncKey(value: number) {
    await Preferences.set({ key: RANDOM_SYNC_KEY_KEY, value: value.toString() });
  }

  // Ble 5 keys
  public static async getBle5Key(): Promise<number[] | undefined> {
    const { value } = await Preferences.get({ key: BLE_5_KEY_KEY });
    return value ? JSON.parse(value) : undefined;
  }

  public static async setBle5Key(value: number[]) {
    await Preferences.set({ key: BLE_5_KEY_KEY, value: JSON.stringify(value) });
  }
}
