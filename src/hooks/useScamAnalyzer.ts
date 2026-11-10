import { useState, useCallback } from 'react';
import { AnalysisResult } from '../types';
import { analyzeUrl } from '../services/scamAnalysis/analyzeUrl';
import { analyzeMessage } from '../services/scamAnalysis/analyzeMessage';
import { saveHistoryItem } from '../services/storage/historyStorage';
import { getSettings } from '../services/storage/settingsStorage';

export function useScamAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

  const checkUrl = useCallback(async (rawUrl: string): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const settings = await getSettings();
      const result = await analyzeUrl(rawUrl, {
        forceDemo: settings.forceDemoMode,
        enableExternalApis: settings.enableExternalApis,
      });

      if (settings.savePreviews) {
        await saveHistoryItem(result);
      }
      setLastResult(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memeriksa URL';
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const checkMessage = useCallback(async (rawMessage: string): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const settings = await getSettings();
      const result = await analyzeMessage(rawMessage, {
        forceDemo: settings.forceDemoMode,
        enableExternalApis: settings.enableExternalApis,
      });

      if (settings.savePreviews) {
        await saveHistoryItem(result);
      }
      setLastResult(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memeriksa pesan';
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setIsAnalyzing(false);
    setError(null);
    setLastResult(null);
  }, []);

  return {
    isAnalyzing,
    error,
    lastResult,
    checkUrl,
    checkMessage,
    resetState,
  };
}
