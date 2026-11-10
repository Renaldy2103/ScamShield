import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RiskLevel } from '../../types';
import { getRiskColor, getRiskLabel, RADIUS, SPACING, TYPOGRAPHY } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface RiskScoreMeterProps {
  score: number;
  level: RiskLevel;
  isDemo?: boolean;
}

export function RiskScoreMeter({ score, level, isDemo = false }: RiskScoreMeterProps) {
  const { colors } = useTheme();
  const riskColor = getRiskColor(level);
  const riskLabel = getRiskLabel(level);

  const getRiskIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (level) {
      case 'critical':
        return 'skull-outline';
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'warning-outline';
      case 'low':
        return 'shield-outline';
      case 'safe-indicative':
      default:
        return 'shield-checkmark';
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: riskColor,
        },
      ]}
    >
      {isDemo && (
        <View style={styles.demoBadge}>
          <Text style={styles.demoText}>Demo Analysis</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${riskColor}22` }]}>
          <Ionicons name={getRiskIcon()} size={36} color={riskColor} />
        </View>
        <View style={styles.scoreInfo}>
          <Text style={[styles.scoreValue, { color: riskColor }]}>
            {score}
            <Text style={[styles.scoreTotal, { color: colors.textSecondary }]}>/100</Text>
          </Text>
          <Text style={[styles.riskLabel, { color: riskColor }]}>{riskLabel}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.inputBg }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(5, Math.min(100, score))}%`,
              backgroundColor: riskColor,
            },
          ]}
        />
      </View>

      {/* Scale Legend */}
      <View style={styles.legendRow}>
        <Text style={[styles.legendText, { color: colors.textMuted }]}>0 (Aman)</Text>
        <Text style={[styles.legendText, { color: colors.textMuted }]}>50 (Sedang)</Text>
        <Text style={[styles.legendText, { color: colors.textMuted }]}>100 (Kritis)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  demoBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: '#F59E0B22',
    borderColor: '#F59E0B',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  demoText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
  },
  scoreTotal: {
    fontSize: 18,
    fontWeight: '400',
  },
  riskLabel: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginTop: 2,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
  },
});
