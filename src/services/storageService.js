import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SETTINGS: '@nivasshub_settings',
  PROFILE: '@nivasshub_profile',
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
};

export const loadSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
};

export const loadProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
