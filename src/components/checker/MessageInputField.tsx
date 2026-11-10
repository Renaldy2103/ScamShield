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

interface MessageInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  error?: string | null;
  placeholder?: string;
  editable?: boolean;
}

export function MessageInputField({
  value,
  onChangeText,
  onClear,
  error,
  placeholder = 'Tempelkan isi SMS, pesan WhatsApp, email, atau penawaran lowongan kerja di sini...',
  editable = true,
}: MessageInputFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Isi Pesan yang Mencurigakan
        </Text>
        <Text style={[styles.charCount, { color: colors.textMuted }]}>
          {value.length} karakter
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel="Kolom input isi pesan"
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={editable}
        />
        {value.length > 0 && editable && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Kosongkan pesan"
            onPress={onClear}
            style={styles.clearBtn}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.clearText, { color: colors.textMuted }]}>Hapus</Text>
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  charCount: {
    ...TYPOGRAPHY.caption,
  },
  inputContainer: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm + 4,
    minHeight: 140,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    lineHeight: 22,
    minHeight: 100,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  clearText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 4,
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
