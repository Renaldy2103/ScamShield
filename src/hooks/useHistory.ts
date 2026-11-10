import { useState, useEffect, useCallback } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import {
  getHistory,
  deleteHistoryItem,
  clearAllHistory,
  saveHistoryItem,
} from '../services/storage/historyStorage';

export function useHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [filterLevel, setFilterLevel] = useState<RiskLevel | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    setIsLoading(true);
    const items = await getHistory();
    setHistory(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getHistory().then((items) => {
      if (isMounted) {
        setHistory(items);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    },
    []
  );

  const clearAll = useCallback(async () => {
    await clearAllHistory();
    setHistory([]);
  }, []);

  const add = useCallback(async (item: AnalysisResult) => {
    await saveHistoryItem(item);
    setHistory((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
  }, []);

  const filteredHistory =
    filterLevel === 'all'
      ? history
      : history.filter((item) => item.level === filterLevel);

  return {
    history: filteredHistory,
    rawCount: history.length,
    filterLevel,
    setFilterLevel,
    isLoading,
    refreshHistory,
    remove,
    clearAll,
    add,
  };
}
