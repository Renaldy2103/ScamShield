import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import {
  getSettings,
  saveSettings,
} from '../../services/storage/settingsStorage';
import { clearAllHistory } from '../../services/storage/historyStorage';
import { UserSettings, AppTheme } from '../../types';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

export default function SettingsScreen() {
  const { colors, themeMode, setTheme } = useTheme();
  const [settings, setSettingsState] = useState<UserSettings>({
    theme: themeMode,
    savePreviews: true,
    enableExternalApis: true,
    forceDemoMode: false,
  });

  useEffect(() => {
    getSettings().then(setSettingsState);
  }, []);

  const handleToggleTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    setSettingsState((prev) => ({ ...prev, theme: newTheme }));
  };

  const handleTogglePreviews = async (val: boolean) => {
    const updated = await saveSettings({ savePreviews: val });
    setSettingsState(updated);
  };

  const handleToggleExternalApis = async (val: boolean) => {
    const updated = await saveSettings({ enableExternalApis: val });
    setSettingsState(updated);
  };

  const handleToggleDemoMode = async (val: boolean) => {
    const updated = await saveSettings({ forceDemoMode: val });
    setSettingsState(updated);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Hapus Riwayat',
      'Seluruh catatan riwayat pemeriksaan di perangkat ini akan dihapus secara permanen.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: async () => {
            await clearAllHistory();
            Alert.alert('Sukses', 'Riwayat berhasil dibersihkan.');
          },
        },
      ]
    );
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Pengaturan" subtitle="Preferensi, Privasi & Keamanan" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tampilan / Tema */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          TAMPILAN
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Tema Aplikasi
          </Text>
          <View style={styles.themeSelector}>
            {(['dark', 'light', 'system'] as AppTheme[]).map((mode) => {
              const isSelected = themeMode === mode;
              const labels: Record<AppTheme, string> = {
                dark: 'Gelap',
                light: 'Terang',
                system: 'Sistem',
              };

              return (
                <TouchableOpacity
                  key={mode}
                  accessibilityRole="button"
                  accessibilityLabel={`Tema ${labels[mode]}`}
                  onPress={() => handleToggleTheme(mode)}
                  style={[
                    styles.themeBtn,
                    {
                      backgroundColor: isSelected ? `${colors.primary}26` : colors.inputBg,
                      borderColor: isSelected ? colors.primaryLight : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      mode === 'dark'
                        ? 'moon-outline'
                        : mode === 'light'
                        ? 'sunny-outline'
                        : 'phone-portrait-outline'
                    }
                    size={16}
                    color={isSelected ? colors.primaryLight : colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.themeBtnText,
                      {
                        color: isSelected ? colors.primaryLight : colors.textSecondary,
                        fontWeight: isSelected ? '700' : '400',
                      },
                    ]}
                  >
                    {labels[mode]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Privasi & Penyimpanan */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          PRIVASI & PENYIMPANAN
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Simpan Riwayat Pemeriksaan
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Simpan ringkasan hasil secara lokal di perangkat Anda untuk referensi.
              </Text>
            </View>
            <Switch
              value={settings.savePreviews}
              onValueChange={handleTogglePreviews}
              thumbColor={settings.savePreviews ? colors.primaryLight : '#9CA3AF'}
              trackColor={{ false: '#374151', true: `${colors.primary}88` }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Hapus seluruh riwayat lokal"
            onPress={handleClearHistory}
            style={styles.dangerRow}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={[styles.dangerText, { color: colors.danger }]}>
              Hapus Seluruh Riwayat Lokal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mesin Pemeriksaan */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          MESIN PEMERIKSAAN
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Integrasi Eksternal Gratis
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Gunakan URLhaus / Google Safe Browsing / Edge proxy saat online.
              </Text>
            </View>
            <Switch
              value={settings.enableExternalApis}
              onValueChange={handleToggleExternalApis}
              thumbColor={settings.enableExternalApis ? colors.primaryLight : '#9CA3AF'}
              trackColor={{ false: '#374151', true: `${colors.primary}88` }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Paksa Mode Demo
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Hanya menggunakan mock dataset lokal untuk pengujian tanpa jaringan.
              </Text>
            </View>
            <Switch
              value={settings.forceDemoMode}
              onValueChange={handleToggleDemoMode}
              thumbColor={settings.forceDemoMode ? colors.primaryLight : '#9CA3AF'}
              trackColor={{ false: '#374151', true: `${colors.primary}88` }}
            />
          </View>
        </View>

        {/* Sumber Intelijen Keamanan */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          SUMBER INTELIJEN & DOKUMENTASI
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Buka situs URLhaus abuse.ch"
            onPress={() => openLink('https://urlhaus.abuse.ch/')}
            style={styles.linkRow}
          >
            <View style={styles.linkTextContainer}>
              <Text style={[styles.linkTitle, { color: colors.textPrimary }]}>
                URLhaus Database (abuse.ch)
              </Text>
              <Text style={[styles.linkDesc, { color: colors.textSecondary }]}>
                Basis data publik pembagian link malware aktif
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Buka situs Google Safe Browsing"
            onPress={() => openLink('https://safebrowsing.google.com/')}
            style={styles.linkRow}
          >
            <View style={styles.linkTextContainer}>
              <Text style={[styles.linkTitle, { color: colors.textPrimary }]}>
                Google Safe Browsing
              </Text>
              <Text style={[styles.linkDesc, { color: colors.textSecondary }]}>
                Layanan deteksi rekayasa sosial dan web berbahaya
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Buka situs Patroli Siber Polri"
            onPress={() => openLink('https://patrolisiber.id/')}
            style={styles.linkRow}
          >
            <View style={styles.linkTextContainer}>
              <Text style={[styles.linkTitle, { color: colors.textPrimary }]}>
                Patroli Siber Polri (Indonesia)
              </Text>
              <Text style={[styles.linkDesc, { color: colors.textSecondary }]}>
                Pusat aduan dan literasi tindak pidana siber Bareskrim
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Tentang & Disclaimer */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          TENTANG APLIKASI
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutTitle, { color: colors.textPrimary }]}>
            ScamShield Mobile v1.0.0
          </Text>
          <Text style={[styles.aboutDesc, { color: colors.textSecondary }]}>
            Aplikasi pendeteksi risiko kejahatan digital untuk melindungi mahasiswa, pencari kerja, dan masyarakat umum dari phishing, penipuan lowongan kerja, dan pencurian OTP.
          </Text>
          <View style={[styles.disclaimerBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Text style={[styles.disclaimerHeading, { color: colors.textPrimary }]}>
              Pernyataan Hukum (Disclaimer)
            </Text>
            <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
              Aplikasi ini hanya menyajikan penilaian probabilitas risiko teknis dan linguistik. Hasil analisis bukan jaminan mutlak keselamatan atau keamanan 100%. Pengembang tidak bertanggung jawab atas tindakan finansial atau privasi yang Anda lakukan secara sukarela di luar aplikasi ini.
            </Text>
          </View>
        </View>
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
    paddingBottom: SPACING.xl + 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs + 2,
    letterSpacing: 0.8,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  themeBtnText: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  settingDesc: {
    ...TYPOGRAPHY.caption,
    lineHeight: 16,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: SPACING.sm,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  dangerText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  linkTextContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  linkTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  linkDesc: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    marginTop: 2,
  },
  aboutTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutDesc: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  disclaimerBox: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm + 4,
    marginTop: 4,
  },
  disclaimerHeading: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginBottom: 2,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
