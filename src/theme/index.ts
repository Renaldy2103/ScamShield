import { DARK_THEME, LIGHT_THEME, ThemeColors, RISK_COLORS, RISK_LABELS, getRiskColor, getRiskLabel } from '../constants/colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyMedium: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 14 },
};

export { DARK_THEME, LIGHT_THEME, RISK_COLORS, RISK_LABELS, getRiskColor, getRiskLabel };
export type { ThemeColors };
