import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisResult } from '../../types';
import { Badge } from '../common/Badge';
import { useTheme } from '../../hooks/useTheme';
import { formatTimeAgo } from '../../utils/dateFormatter';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

interface RecentCheckItemProps {
  item: AnalysisResult;
  onPress: () => void;
}

export function RecentCheckItem({ item, onPress }: RecentCheckItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Riwayat ${item.type}: ${item.inputPreview}`}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.typeTag}>
          <Ionicons
            name={item.type === 'url' ? 'link-outline' : 'chatbubble-ellipses-outline'}
            size={14}
            color={colors.primaryLight}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.typeText, { color: colors.textSecondary }]}>
            {item.type === 'url' ? 'Link' : 'Pesan'}
          </Text>
        </View>
        <Text style={[styles.timeText, { color: colors.textMuted }]}>
          {formatTimeAgo(item.createdAt)}
        </Text>
      </View>

      <Text
        style={[styles.preview, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {item.inputPreview}
      </Text>

      <View style={styles.bottomRow}>
        <Badge level={item.level} size="sm" />
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
            Skor:
          </Text>
          <Text style={[styles.scoreVal, { color: colors.textPrimary }]}>
            {item.score}/100
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 11,
  },
  preview: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  scoreVal: {
    fontSize: 12,
    fontWeight: '700',
  },
});
