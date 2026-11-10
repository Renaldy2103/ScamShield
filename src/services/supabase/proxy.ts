import { ProviderCheckResult } from '../scamAnalysis/safeBrowsingProvider';
import { getSupabaseConfig } from './client';

/**
 * Proxy threat check through Supabase Edge Function to keep third-party API keys off mobile clients.
 */
export async function checkThreatViaSupabaseProxy(
  url: string,
  timeoutMs = 4500
): Promise<ProviderCheckResult | null> {
  const config = getSupabaseConfig();

  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  const endpoint = `${config.url}/functions/v1/check-threat`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.anonKey}`,
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      checked: true,
      flagged: Boolean(data.flagged),
      threatType: data.threatType,
      source: 'Supabase Security Edge Proxy',
      details: data.details || (data.flagged ? 'Terdeteksi ancaman oleh server proxy' : 'Aman menurut proxy'),
    };
  } catch {
    clearTimeout(timer);
    return null;
  }
}
