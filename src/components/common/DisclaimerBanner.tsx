import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../theme';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${colors.primary}12`,
          borderColor: `${colors.primary}44`,
          padding: compact ? SPACING.sm : SPACING.md,
        },
      ]}
    >
      <Ionicons
        name="shield-checkmark-outline"
        size={compact ? 16 : 20}
        color={colors.primaryLight}
        style={styles.icon}
      />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontSize: compact ? 12 : 13 },
          ]}
        >
          Penilaian Bersifat Indikatif
        </Text>
        <Text
          style={[
            styles.text,
            { color: colors.textSecondary, fontSize: compact ? 11 : 12 },
          ]}
        >
          ScamShield mendeteksi indikator risiko berdasarkan pola teknis dan linguistik. Hasil bukan jaminan keamanan 100%. Selalu konfirmasi ke kanal resmi.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginVertical: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: 2,
  },
  text: {
    ...TYPOGRAPHY.caption,
    lineHeight: 16,
  },
});
