import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RiskIndicator } from '../../types';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface IndicatorListProps {
  indicators: RiskIndicator[];
}

export function IndicatorList({ indicators }: IndicatorListProps) {
  const { colors } = useTheme();

  if (indicators.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name="checkmark-circle-outline" size={32} color="#22C55E" />
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          Tidak Ditemukan Indikator Bahaya
        </Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          Pemeriksaan saat ini tidak mendeteksi anomali atau pola scam umum.
        </Text>
      </View>
    );
  }

  const getSeverityColor = (severity: 'info' | 'warning' | 'danger') => {
    switch (severity) {
      case 'danger':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
      default:
        return '#38BDF8';
    }
  };

  const getSeverityIcon = (
    severity: 'info' | 'warning' | 'danger'
  ): keyof typeof Ionicons.glyphMap => {
    switch (severity) {
      case 'danger':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Daftar Temuan ({indicators.length})
      </Text>

      {indicators.map((indicator, index) => {
        const itemColor = getSeverityColor(indicator.severity);

        return (
          <View
            key={indicator.id || `ind_${index}`}
            style={[
              styles.indicatorItem,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.indicatorHeader}>
              <View style={styles.indicatorTitleRow}>
                <Ionicons
                  name={getSeverityIcon(indicator.severity)}
                  size={18}
                  color={itemColor}
                  style={styles.icon}
                />
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {indicator.title}
                </Text>
              </View>
              <View
                style={[
                  styles.pointsBadge,
                  { backgroundColor: `${itemColor}22`, borderColor: itemColor },
                ]}
              >
                <Text style={[styles.pointsText, { color: itemColor }]}>
                  +{indicator.points}
                </Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {indicator.description}
            </Text>

            {indicator.source && (
              <Text style={[styles.sourceText, { color: colors.textMuted }]}>
                Sumber: {indicator.source}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  indicatorItem: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  icon: {
    marginRight: 6,
  },
  title: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    flex: 1,
  },
  pointsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 18,
    marginTop: 2,
  },
  sourceText: {
    ...TYPOGRAPHY.caption,
    marginTop: 6,
    fontSize: 10,
  },
  emptyContainer: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  emptyDesc: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginTop: 4,
  },
});
