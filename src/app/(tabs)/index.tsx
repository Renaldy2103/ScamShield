import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHistory } from '../../hooks/useHistory';
import { Header } from '../../components/common/Header';
import { DisclaimerBanner } from '../../components/common/DisclaimerBanner';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { RecentCheckItem } from '../../components/home/RecentCheckItem';
import { SecurityTipsCard } from '../../components/home/SecurityTipsCard';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { history, isLoading } = useHistory();

  const recentItems = history.slice(0, 3);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="ScamShield"
        subtitle="Deteksi Cerdas URL & Pesan Penipuan"
        rightAction={
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Buka halaman edukasi"
            onPress={() => router.push('/(tabs)/learn')}
            style={[styles.learnIconBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="help-buoy-outline" size={20} color={colors.primaryLight} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTextContainer}>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
              Lindungi Diri dari Kejahatan Siber
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Cek keabsahan tautan asing atau pesan mencurigakan sebelum membuka, login, atau melakukan transfer.
            </Text>
          </View>
        </View>

        {/* Disclaimer Banner */}
        <DisclaimerBanner compact />

        {/* Action Buttons */}
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
          Pilih Mode Pemeriksaan
        </Text>

        <QuickActionCard
          title="Periksa Tautan (URL)"
          description="Deteksi phishing, domain palsu, penipuan hadiah, dan shortener."
          iconName="link"
          badgeText="Populer"
          accentColor="#6366F1"
          onPress={() => router.push('/check-url')}
        />

        <QuickActionCard
          title="Periksa Pesan & SMS"
          description="Pindai pola penipuan lowongan kerja, ancaman blokir, dan pencurian OTP."
          iconName="chatbubble-ellipses"
          accentColor="#EC4899"
          onPress={() => router.push('/check-message')}
        />

        {/* Quick Tips */}
        <SecurityTipsCard />

        {/* Recent Checks */}
        <View style={styles.recentSectionHeader}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, marginBottom: 0 }]}>
            Riwayat Terakhir
          </Text>
          {history.length > 0 && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Lihat semua riwayat"
              onPress={() => router.push('/(tabs)/history')}
            >
              <Text style={[styles.seeAllText, { color: colors.primaryLight }]}>
                Lihat Semua ({history.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Memuat riwayat...
          </Text>
        ) : recentItems.length === 0 ? (
          <View style={[styles.emptyBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Ionicons name="search-outline" size={28} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Belum ada pemeriksaan. Coba periksa tautan atau pesan di atas!
            </Text>
          </View>
        ) : (
          recentItems.map((item) => (
            <RecentCheckItem
              key={item.id}
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/history-detail',
                  params: { id: item.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl + 20,
  },
  learnIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    marginBottom: 6,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 18,
  },
  sectionHeading: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  seeAllText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  loadingText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  emptyBox: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginTop: 8,
  },
});
