import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/common/Header';
import { UrlInputField } from '../components/checker/UrlInputField';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useScamAnalyzer } from '../hooks/useScamAnalyzer';
import { SAMPLE_URLS } from '../data/mockSamples';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export default function CheckUrlScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { checkUrl, isAnalyzing, error } = useScamAnalyzer();

  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) {
      setLocalError('Silakan masukkan alamat URL terlebih dahulu');
      return;
    }

    setLocalError(null);
    try {
      const result = await checkUrl(url);
      router.push({
        pathname: '/result',
        params: { resultData: JSON.stringify(result) },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pemeriksaan gagal dilakukan';
      setLocalError(msg);
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setLocalError(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="Periksa Tautan (URL)"
        subtitle="Analisis Phishing, Domain & Enkripsi"
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.guideText, { color: colors.textSecondary }]}>
          Masukkan link yang Anda terima melalui SMS, WhatsApp, media sosial, atau email sebelum membukanya di browser.
        </Text>

        <UrlInputField
          value={url}
          onChangeText={(val) => {
            setUrl(val);
            if (localError) setLocalError(null);
          }}
          onClear={() => {
            setUrl('');
            setLocalError(null);
          }}
          error={localError || error}
          editable={!isAnalyzing}
        />

        <Button
          title={isAnalyzing ? 'Sedang Memeriksa URL...' : 'Periksa Sekarang'}
          onPress={handleCheck}
          loading={isAnalyzing}
          disabled={isAnalyzing}
          icon={
            !isAnalyzing ? (
              <Ionicons
                name="shield-checkmark"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
            ) : undefined
          }
          style={styles.checkButton}
        />

        {/* Contoh Sampel Uji Coba */}
        <View style={styles.samplesSection}>
          <Text style={[styles.samplesHeader, { color: colors.textSecondary }]}>
            ATAU COBA CONTOH SAMPEL:
          </Text>

          {SAMPLE_URLS.map((sample, idx) => (
            <TouchableOpacity
              key={`sample_${idx}`}
              accessibilityRole="button"
              accessibilityLabel={`Gunakan contoh ${sample.title}`}
              onPress={() => handleSelectSample(sample.url)}
              disabled={isAnalyzing}
              style={[
                styles.sampleCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.sampleTop}>
                <Text style={[styles.sampleTitle, { color: colors.textPrimary }]}>
                  {sample.title}
                </Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primaryLight} />
              </View>
              <Text
                style={[styles.sampleUrl, { color: colors.primaryLight }]}
                numberOfLines={1}
              >
                {sample.url}
              </Text>
              <Text style={[styles.sampleDesc, { color: colors.textMuted }]}>
                {sample.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <DisclaimerBanner compact />
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
  guideText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  checkButton: {
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  samplesSection: {
    marginBottom: SPACING.md,
  },
  samplesHeader: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  sampleCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  sampleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sampleTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  sampleUrl: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
    marginBottom: 2,
  },
  sampleDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});
