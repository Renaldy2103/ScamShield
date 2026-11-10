import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisResult } from '../../types';
import { Badge } from '../common/Badge';
import { useTheme } from '../../hooks/useTheme';
import { formatDateTime } from '../../utils/dateFormatter';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

interface HistoryCardProps {
  item: AnalysisResult;
  onPress: () => void;
  onDelete: () => void;
}

export function HistoryCard({ item, onPress, onDelete }: HistoryCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Buka detail pemeriksaan ${item.type}`}
        onPress={onPress}
        style={styles.contentArea}
      >
        <View style={styles.topRow}>
          <View style={styles.typeBadge}>
            <Ionicons
              name={item.type === 'url' ? 'link-outline' : 'chatbubble-ellipses-outline'}
              size={14}
              color={colors.primaryLight}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.typeText, { color: colors.textSecondary }]}>
              {item.type === 'url' ? 'Tautan' : 'Pesan'}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textMuted }]}>
            {formatDateTime(item.createdAt)}
          </Text>
        </View>

        <Text
          style={[styles.preview, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {item.inputPreview}
        </Text>

        <View style={styles.footerRow}>
          <Badge level={item.level} size="sm" />
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
              Skor: <Text style={{ fontWeight: '700' }}>{item.score}/100</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Hapus item riwayat ini"
        onPress={onDelete}
        style={[styles.deleteButton, { borderTopColor: colors.border }]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.danger} />
        <Text style={[styles.deleteText, { color: colors.danger }]}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.sm + 4,
    overflow: 'hidden',
  },
  contentArea: {
    padding: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    ...TYPOGRAPHY.caption,
  },
  preview: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
  },
  deleteButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: SPACING.xs,
  },
  deleteText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginLeft: 6,
  },
});
