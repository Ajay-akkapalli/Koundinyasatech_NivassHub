import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@constants/storage';

export async function storeData<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export async function getData<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? (JSON.parse(value) as T) : null;
  } catch (e) {
    console.error('Storage read error:', e);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Storage remove error:', e);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Storage clear error:', e);
  }
}

export const saveSettings = <T>(settings: T): Promise<void> =>
  storeData(STORAGE_KEYS.SETTINGS, settings);

export const loadSettings = <T>(): Promise<T | null> =>
  getData<T>(STORAGE_KEYS.SETTINGS);

export const saveProfile = <T>(profile: T): Promise<void> =>
  storeData(STORAGE_KEYS.PROFILE, profile);

export const loadProfile = <T>(): Promise<T | null> =>
  getData<T>(STORAGE_KEYS.PROFILE);

export const getAuthToken = (): Promise<string | null> =>
  getData<string>(STORAGE_KEYS.AUTH_TOKEN);

export const setAuthToken = (token: string): Promise<void> =>
  storeData(STORAGE_KEYS.AUTH_TOKEN, token);

export const clearAuthToken = (): Promise<void> =>
  removeData(STORAGE_KEYS.AUTH_TOKEN);
