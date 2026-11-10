import { RiskLevel } from '../types';

export const RISK_COLORS: Record<RiskLevel, string> = {
  'safe-indicative': '#22C55E',
  low: '#84CC16',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  'safe-indicative': 'Aman secara indikatif',
  low: 'Risiko Rendah',
  medium: 'Risiko Sedang',
  high: 'Risiko Tinggi',
  critical: 'Risiko Kritis',
};

export const DARK_THEME = {
  background: '#0B1120',
  surface: '#111827',
  card: '#1F2937',
  cardHover: '#283548',
  border: '#374151',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  accent: '#38BDF8',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#22C55E',
  inputBg: '#131D31',
  codeBg: '#080E1A',
};

export const LIGHT_THEME = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardHover: '#F1F5F9',
  border: '#E2E8F0',
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  accent: '#0284C7',
  danger: '#DC2626',
  warning: '#D97706',
  success: '#16A34A',
  inputBg: '#F1F5F9',
  codeBg: '#E2E8F0',
};

export type ThemeColors = typeof DARK_THEME;

export function getRiskColor(level: RiskLevel): string {
  return RISK_COLORS[level] || RISK_COLORS.medium;
}

export function getRiskLabel(level: RiskLevel): string {
  return RISK_LABELS[level] || 'Tidak diketahui';
}
