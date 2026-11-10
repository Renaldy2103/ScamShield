import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface RecommendationListProps {
  recommendations: string[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Rekomendasi Tindakan
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {recommendations.map((rec, index) => (
          <View
            key={`rec_${index}`}
            style={[
              styles.row,
              index < recommendations.length - 1 && {
                borderBottomColor: colors.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <View style={[styles.bullet, { backgroundColor: `${colors.primary}22` }]}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={colors.primaryLight}
              />
            </View>
            <Text style={[styles.text, { color: colors.textPrimary }]}>{rec}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm + 2,
  },
  bullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  text: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
  },
});
