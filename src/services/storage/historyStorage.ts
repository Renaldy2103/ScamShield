import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '../../types';

const HISTORY_STORAGE_KEY = '@scamshield:history_v1';
const MAX_HISTORY_ITEMS = 100;

export async function getHistory(): Promise<AnalysisResult[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function getHistoryItemById(id: string): Promise<AnalysisResult | null> {
  const all = await getHistory();
  return all.find((item) => item.id === id) || null;
}

export async function saveHistoryItem(item: AnalysisResult): Promise<void> {
  try {
    const current = await getHistory();
    // Prepend new item and filter duplicates by id
    const filtered = current.filter((existing) => existing.id !== item.id);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Gagal menyimpan riwayat analisis:', error);
    }
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    const current = await getHistory();
    const updated = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Gagal menghapus entri riwayat:', error);
    }
  }
}

export async function clearAllHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Gagal mengosongkan riwayat:', error);
    }
  }
}
