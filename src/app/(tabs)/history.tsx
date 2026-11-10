import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHistory } from '../../hooks/useHistory';
import { Header } from '../../components/common/Header';
import { HistoryFilter } from '../../components/history/HistoryFilter';
import { HistoryCard } from '../../components/history/HistoryCard';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../theme';

export default function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    history,
    rawCount,
    filterLevel,
    setFilterLevel,
    remove,
    clearAll,
  } = useHistory();

  const confirmClearAll = () => {
    Alert.alert(
      'Hapus Seluruh Riwayat',
      'Apakah Anda yakin ingin menghapus semua catatan pemeriksaan lokal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => clearAll(),
        },
      ]
    );
  };

  const confirmDeleteOne = (id: string) => {
    Alert.alert(
      'Hapus Riwayat',
      'Hapus item pemeriksaan ini dari penyimpanan lokal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => remove(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="Riwayat Pemeriksaan"
        subtitle={`Tersimpan lokal (${rawCount} entri)`}
        rightAction={
          rawCount > 0 ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Hapus semua riwayat"
              onPress={confirmClearAll}
              style={[styles.clearBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <HistoryFilter selected={filterLevel} onSelect={setFilterLevel} />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() =>
              router.push({
                pathname: '/history-detail',
                params: { id: item.id },
              })
            }
            onDelete={() => confirmDeleteOne(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="archive-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {filterLevel === 'all'
                ? 'Belum Ada Riwayat'
                : `Tidak Ada Riwayat dengan Kategori "${filterLevel}"`}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Hasil analisis yang Anda lakukan akan tersimpan di sini secara aman di perangkat lokal Anda.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl + 20,
  },
  clearBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    marginTop: SPACING.xl,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyDesc: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
});
