import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/common/Header';
import { RiskScoreMeter } from '../components/result/RiskScoreMeter';
import { IndicatorList } from '../components/result/IndicatorList';
import { RecommendationList } from '../components/result/RecommendationList';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Button } from '../components/common/Button';
import { AnalysisResult } from '../types';
import { formatDateTime } from '../utils/dateFormatter';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export default function ResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ resultData?: string }>();

  let result: AnalysisResult | null = null;
  if (params.resultData) {
    try {
      result = JSON.parse(params.resultData) as AnalysisResult;
    } catch {
      result = null;
    }
  }

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `[ScamShield] Hasil analisis ${result.type === 'url' ? 'URL' : 'Pesan'}:
Skor Risiko: ${result.score}/100 (${result.level})
Ringkasan: ${result.summary}
Periksa tautan mencurigakan Anda dengan ScamShield.`,
      });
    } catch {
      // share dismissed
    }
  };

  if (!result) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Header title="Hasil Pemeriksaan" showBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
            Data Hasil Tidak Ditemukan
          </Text>
          <Button
            title="Kembali ke Beranda"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="Hasil Pemeriksaan"
        subtitle={`Dianalisis pada ${formatDateTime(result.createdAt)}`}
        showBack
        rightAction={
          <Button
            title="Bagikan"
            onPress={handleShare}
            variant="outline"
            style={styles.shareBtn}
            textStyle={{ fontSize: 12 }}
            icon={<Ionicons name="share-social-outline" size={14} color={colors.textPrimary} style={{ marginRight: 4 }} />}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Risk Score Card */}
        <RiskScoreMeter
          score={result.score}
          level={result.level}
          isDemo={result.isDemo}
        />

        {/* Input Target Preview */}
        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.previewHeader}>
            <Ionicons
              name={result.type === 'url' ? 'link' : 'chatbubble-ellipses'}
              size={14}
              color={colors.primaryLight}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              {result.type === 'url' ? 'Tautan yang Diperiksa' : 'Teks Pesan yang Diperiksa'}
            </Text>
          </View>
          <Text style={[styles.previewContent, { color: colors.textPrimary }]}>
            {result.inputPreview}
          </Text>
        </View>

        {/* Summary Card */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
            Ringkasan Analisis
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {result.summary}
          </Text>
        </View>

        {/* Indicators List */}
        <IndicatorList indicators={result.indicators} />

        {/* Recommendations List */}
        <RecommendationList recommendations={result.recommendations} />

        {/* Sources Info */}
        {result.sources.length > 0 && (
          <View style={[styles.sourcesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sourcesTitle, { color: colors.textPrimary }]}>
              Metode & Sumber Pemeriksaan:
            </Text>
            {result.sources.map((src, idx) => (
              <Text key={`src_${idx}`} style={[styles.sourceItem, { color: colors.textSecondary }]}>
                • {src}
              </Text>
            ))}
          </View>
        )}

        <DisclaimerBanner />

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Periksa Lainnya"
            variant="outline"
            onPress={() => router.back()}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Button
            title="Ke Beranda"
            variant="primary"
            onPress={() => router.replace('/(tabs)')}
            style={{ flex: 1 }}
          />
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
    paddingBottom: SPACING.xl + 24,
  },
  shareBtn: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  previewCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 4,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  previewContent: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  summaryCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
  },
  sourcesCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sourcesTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sourceItem: {
    ...TYPOGRAPHY.caption,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.md,
  },
});
