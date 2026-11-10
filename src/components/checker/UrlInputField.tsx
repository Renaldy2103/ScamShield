import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

interface UrlInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  error?: string | null;
  placeholder?: string;
  editable?: boolean;
}

export function UrlInputField({
  value,
  onChangeText,
  onClear,
  error,
  placeholder = 'Contoh: https://klikbca-update.xyz/login',
  editable = true,
}: UrlInputFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Alamat URL yang Ingin Diperiksa
      </Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <Ionicons
          name="link-outline"
          size={20}
          color={colors.textSecondary}
          style={styles.leadingIcon}
        />
        <TextInput
          accessibilityLabel="Kolom input URL"
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={editable}
        />
        {value.length > 0 && editable && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Hapus isi input"
            onPress={onClear}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    marginBottom: SPACING.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    minHeight: 52,
  },
  leadingIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    paddingVertical: SPACING.sm,
  },
  clearBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 4,
  },
});
