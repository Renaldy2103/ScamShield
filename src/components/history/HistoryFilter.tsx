import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '../../types';
import { RISK_COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface HistoryFilterProps {
  selected: RiskLevel | 'all';
  onSelect: (level: RiskLevel | 'all') => void;
}

const FILTER_ITEMS: { key: RiskLevel | 'all'; label: string; color?: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'critical', label: 'Kritis', color: RISK_COLORS.critical },
  { key: 'high', label: 'Tinggi', color: RISK_COLORS.high },
  { key: 'medium', label: 'Sedang', color: RISK_COLORS.medium },
  { key: 'low', label: 'Rendah', color: RISK_COLORS.low },
  { key: 'safe-indicative', label: 'Aman', color: RISK_COLORS['safe-indicative'] },
];

export function HistoryFilter({ selected, onSelect }: HistoryFilterProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.wrapper}
    >
      {FILTER_ITEMS.map((item) => {
        const isSelected = selected === item.key;
        const activeColor = item.color || colors.primary;

        return (
          <TouchableOpacity
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={`Filter ${item.label}`}
            onPress={() => onSelect(item.key)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? `${activeColor}22` : colors.card,
                borderColor: isSelected ? activeColor : colors.border,
              },
            ]}
          >
            {item.color && (
              <Text
                style={[
                  styles.dot,
                  { color: item.color },
                ]}
              >
                ●
              </Text>
            )}
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? activeColor : colors.textSecondary,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: SPACING.sm,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 38,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  dot: {
    fontSize: 10,
    marginRight: 6,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
});
