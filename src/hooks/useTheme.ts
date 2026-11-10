import { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { DARK_THEME, LIGHT_THEME, ThemeColors } from '../theme';
import { getSettings, saveSettings } from '../services/storage/settingsStorage';
import { AppTheme } from '../types';

export function useTheme() {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<AppTheme>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      setThemeMode(settings.theme);
      setIsLoaded(true);
    });
  }, []);

  const setTheme = useCallback(async (mode: AppTheme) => {
    setThemeMode(mode);
    await saveSettings({ theme: mode });
  }, []);

  const isDark =
    themeMode === 'system'
      ? systemScheme !== 'light'
      : themeMode === 'dark';

  const colors: ThemeColors = isDark ? DARK_THEME : LIGHT_THEME;

  return {
    themeMode,
    isDark,
    colors,
    setTheme,
    isLoaded,
  };
}
