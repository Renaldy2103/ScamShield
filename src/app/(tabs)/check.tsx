import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { DisclaimerBanner } from '../../components/common/DisclaimerBanner';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

export default function CheckHubScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Pusat Pemeriksaan" subtitle="Analisis Risiko Penipuan Digital" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Pilih salah satu metode analisis di bawah ini untuk memulai pengujian risiko keamanan.
        </Text>

        <QuickActionCard
          title="Periksa Tautan (URL)"
          description="Deteksi domain tiruan (typosquatting), ketiadaan sertifikat SSL HTTPS, subdomain berlapis, dan pemendek tautan mencurigakan."
          iconName="link"
          accentColor="#6366F1"
          onPress={() => router.push('/check-url')}
        />

        <QuickActionCard
          title="Periksa Pesan / SMS"
          description="Pindai pola percakapan penipuan rekrutmen lowongan kerja, transfer uang di muka, ancaman pemblokiran kartu, dan pancingan OTP."
          iconName="chatbubble-ellipses"
          accentColor="#EC4899"
          onPress={() => router.push('/check-message')}
        />

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
            Bagaimana Kami Menilai Risiko?
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Indikator teknis: protokol enkripsi, reputasi domain, IP address host.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Pola rekayasa sosial: tekanan waktu, iming-iming hadiah, permintaan kredensial rahasia.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Basis data ancaman: integrasi sumber terbuka terpercaya (URLhaus, Mock DB).
          </Text>
        </View>

        <DisclaimerBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  desc: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  infoCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    marginBottom: SPACING.xs + 2,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: 4,
  },
});
