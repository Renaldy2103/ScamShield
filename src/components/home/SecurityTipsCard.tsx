import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

export function SecurityTipsCard() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="bulb-outline" size={20} color="#F59E0B" style={{ marginRight: 6 }} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Aturan Emas Anti Scam
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Lihat semua edukasi keamanan"
          onPress={() => router.push('/(tabs)/learn')}
        >
          <Text style={[styles.seeAll, { color: colors.primaryLight }]}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.bullet, { color: colors.textSecondary }]}>
        • <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>Jangan bagi OTP:</Text> Lembaga resmi mana pun tidak pernah meminta kode OTP atau PIN Anda.
      </Text>
      <Text style={[styles.bullet, { color: colors.textSecondary }]}>
        • <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>Waspada Urgensi:</Text> Penipu selalu mendesak transfer cepat atau ancaman akun diblokir.
      </Text>
      <Text style={[styles.bullet, { color: colors.textSecondary }]}>
        • <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>Cek Nama Domain:</Text> Selalu periksa domain lengkap sebelum memasukkan login di browser.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
  },
  seeAll: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  bullet: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: 4,
  },
});
