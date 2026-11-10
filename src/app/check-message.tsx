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
import { MessageInputField } from '../components/checker/MessageInputField';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useScamAnalyzer } from '../hooks/useScamAnalyzer';
import { SAMPLE_MESSAGES } from '../data/mockSamples';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export default function CheckMessageScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { checkMessage, isAnalyzing, error } = useScamAnalyzer();

  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!message.trim()) {
      setLocalError('Silakan tempelkan isi pesan terlebih dahulu');
      return;
    }

    setLocalError(null);
    try {
      const result = await checkMessage(message);
      router.push({
        pathname: '/result',
        params: { resultData: JSON.stringify(result) },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pemeriksaan gagal dilakukan';
      setLocalError(msg);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setMessage(sampleText);
    setLocalError(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="Periksa Pesan / SMS"
        subtitle="Analisis Penipuan Loker, OTP & Rekening"
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.guideText, { color: colors.textSecondary }]}>
          Tempelkan pesan mencurigakan dari WhatsApp, Telegram, SMS, atau email untuk mendeteksi indikator manipulasi psikologis dan pencurian data.
        </Text>

        <MessageInputField
          value={message}
          onChangeText={(val) => {
            setMessage(val);
            if (localError) setLocalError(null);
          }}
          onClear={() => {
            setMessage('');
            setLocalError(null);
          }}
          error={localError || error}
          editable={!isAnalyzing}
        />

        <Button
          title={isAnalyzing ? 'Sedang Menganalisis Pola Kalimat...' : 'Analisis Pesan'}
          onPress={handleCheck}
          loading={isAnalyzing}
          disabled={isAnalyzing}
          icon={
            !isAnalyzing ? (
              <Ionicons
                name="chatbubble-ellipses-outline"
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

          {SAMPLE_MESSAGES.map((sample, idx) => (
            <TouchableOpacity
              key={`sample_msg_${idx}`}
              accessibilityRole="button"
              accessibilityLabel={`Gunakan contoh ${sample.title}`}
              onPress={() => handleSelectSample(sample.text)}
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
                style={[styles.sampleText, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                &ldquo;{sample.text}&rdquo;
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
    marginBottom: 4,
  },
  sampleTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  sampleText: {
    ...TYPOGRAPHY.caption,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sampleDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});
