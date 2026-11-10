import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
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
import { getHistoryItemById, deleteHistoryItem } from '../services/storage/historyStorage';
import { AnalysisResult } from '../types';
import { formatDateTime } from '../utils/dateFormatter';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const [item, setItem] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(params?.id));

  useEffect(() => {
    if (!params?.id) return;

    let isMounted = true;
    getHistoryItemById(params.id)
      .then((data) => {
        if (isMounted) setItem(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [params?.id]);

  const handleDelete = () => {
    if (!item) return;

    Alert.alert(
      'Hapus Catatan',
      'Hapus pemeriksaan ini dari riwayat lokal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await deleteHistoryItem(item.id);
            router.back();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Header title="Detail Riwayat" showBack />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Header title="Detail Riwayat" showBack />
        <View style={styles.centerBox}>
          <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.notFoundTitle, { color: colors.textPrimary }]}>
            Data Riwayat Tidak Ditemukan
          </Text>
          <Button
            title="Kembali"
            onPress={() => router.back()}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="Detail Riwayat"
        subtitle={formatDateTime(item.createdAt)}
        showBack
        rightAction={
          <Button
            title="Hapus"
            variant="danger"
            onPress={handleDelete}
            style={styles.delBtn}
            textStyle={{ fontSize: 12 }}
            icon={<Ionicons name="trash-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <RiskScoreMeter
          score={item.score}
          level={item.level}
          isDemo={item.isDemo}
        />

        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.previewHeader}>
            <Ionicons
              name={item.type === 'url' ? 'link' : 'chatbubble-ellipses'}
              size={14}
              color={colors.primaryLight}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              {item.type === 'url' ? 'Tautan yang Diperiksa' : 'Teks Pesan yang Diperiksa'}
            </Text>
          </View>
          <Text style={[styles.previewContent, { color: colors.textPrimary }]}>
            {item.inputPreview}
          </Text>
        </View>

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
            {item.summary}
          </Text>
        </View>

        <IndicatorList indicators={item.indicators} />
        <RecommendationList recommendations={item.recommendations} />

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
    paddingBottom: SPACING.xl + 20,
  },
  delBtn: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  notFoundTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.md,
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
});
