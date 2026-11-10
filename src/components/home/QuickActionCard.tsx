import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

interface QuickActionCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  badgeText?: string;
  onPress: () => void;
  accentColor?: string;
}

export function QuickActionCard({
  title,
  description,
  iconName,
  badgeText,
  onPress,
  accentColor,
}: QuickActionCardProps) {
  const { colors } = useTheme();
  const themeAccent = accentColor || colors.primary;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: `${themeAccent}1F` }]}>
        <Ionicons name={iconName} size={26} color={themeAccent} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          {badgeText && (
            <View style={[styles.badge, { backgroundColor: `${themeAccent}26` }]}>
              <Text style={[styles.badgeText, { color: themeAccent }]}>
                {badgeText}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  desc: {
    ...TYPOGRAPHY.bodySmall,
  },
});
