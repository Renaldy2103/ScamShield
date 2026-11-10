import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '../../types';
import { getRiskColor, getRiskLabel, RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

interface BadgeProps {
  level?: RiskLevel;
  text?: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ level, text, color, size = 'sm' }: BadgeProps) {
  const badgeColor = color || (level ? getRiskColor(level) : '#6366F1');
  const labelText = text || (level ? getRiskLabel(level) : '');

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${badgeColor}22`,
          borderColor: badgeColor,
          paddingHorizontal: isSmall ? SPACING.sm : SPACING.md,
          paddingVertical: isSmall ? 2 : SPACING.xs,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: badgeColor }]} />
      <Text
        style={[
          styles.text,
          {
            color: badgeColor,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {labelText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});
