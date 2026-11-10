import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { EDUCATION_ARTICLES } from '../../data/educationData';
import { SecurityArticle } from '../../types';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

export default function LearnScreen() {
  const { colors } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(EDUCATION_ARTICLES[0].id);

  const toggleArticle = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const getCategoryIcon = (category: SecurityArticle['category']): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case 'phishing':
        return 'fish-outline';
      case 'otp':
        return 'key-outline';
      case 'loker':
        return 'briefcase-outline';
      case 'marketplace':
        return 'cart-outline';
      case 'domain':
        return 'globe-outline';
      case 'tindakan':
        return 'alert-circle-outline';
      case 'pelaporan':
      default:
        return 'megaphone-outline';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="Edukasi Keamanan"
        subtitle="Panduan & Strategi Melawan Penipuan Digital"
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.introText, { color: colors.textSecondary }]}>
          Pelajari modus operandi kejahatan siber yang marak di Indonesia agar Anda dan keluarga selalu terlindungi.
        </Text>

        {EDUCATION_ARTICLES.map((article) => {
          const isOpen = selectedId === article.id;
          const iconName = getCategoryIcon(article.category);

          return (
            <View
              key={article.id}
              style={[
                styles.articleCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isOpen ? colors.primaryLight : colors.border,
                },
              ]}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={article.title}
                onPress={() => toggleArticle(article.id)}
                style={styles.cardHeader}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${colors.primary}22` },
                  ]}
                >
                  <Ionicons name={iconName} size={20} color={colors.primaryLight} />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    {article.title}
                  </Text>
                  <Text style={[styles.categoryTag, { color: colors.textMuted }]}>
                    Topik: {article.category.toUpperCase()}
                  </Text>
                </View>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={[styles.body, { borderTopColor: colors.border }]}>
                  <Text style={[styles.summary, { color: colors.textPrimary }]}>
                    {article.summary}
                  </Text>

                  {article.warningSigns.length > 0 && (
                    <View style={styles.subSection}>
                      <View style={styles.subSectionTitleRow}>
                        <Ionicons name="warning-outline" size={16} color="#F59E0B" />
                        <Text style={[styles.subSectionTitle, { color: '#F59E0B' }]}>
                          Ciri-ciri & Tanda Bahaya:
                        </Text>
                      </View>
                      {article.warningSigns.map((sign, idx) => (
                        <Text
                          key={`sign_${idx}`}
                          style={[styles.listItem, { color: colors.textSecondary }]}
                        >
                          • {sign}
                        </Text>
                      ))}
                    </View>
                  )}

                  {article.tips.length > 0 && (
                    <View style={styles.subSection}>
                      <View style={styles.subSectionTitleRow}>
                        <Ionicons name="shield-checkmark-outline" size={16} color="#22C55E" />
                        <Text style={[styles.subSectionTitle, { color: '#22C55E' }]}>
                          Tips Pencegahan:
                        </Text>
                      </View>
                      {article.tips.map((tip, idx) => (
                        <Text
                          key={`tip_${idx}`}
                          style={[styles.listItem, { color: colors.textSecondary }]}
                        >
                          • {tip}
                        </Text>
                      ))}
                    </View>
                  )}

                  {article.actionSteps.length > 0 && (
                    <View style={styles.subSection}>
                      <View style={styles.subSectionTitleRow}>
                        <Ionicons name="flash-outline" size={16} color="#38BDF8" />
                        <Text style={[styles.subSectionTitle, { color: '#38BDF8' }]}>
                          Langkah yang Harus Dilakukan:
                        </Text>
                      </View>
                      {article.actionSteps.map((step, idx) => (
                        <Text
                          key={`step_${idx}`}
                          style={[styles.listItem, { color: colors.textSecondary }]}
                        >
                          • {step}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
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
  introText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  articleCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    minHeight: 64,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm + 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
  },
  categoryTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: 2,
  },
  body: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: SPACING.md,
  },
  summary: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  subSection: {
    marginTop: SPACING.sm,
  },
  subSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subSectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  listItem: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
    marginBottom: 4,
    paddingLeft: 6,
  },
});
