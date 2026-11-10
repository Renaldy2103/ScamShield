import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../../types';

const SETTINGS_STORAGE_KEY = '@scamshield:settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  savePreviews: true,
  enableExternalApis: true,
  forceDemoMode: false,
};

export async function getSettings(): Promise<UserSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(
  partial: Partial<UserSettings>
): Promise<UserSettings> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...partial };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
