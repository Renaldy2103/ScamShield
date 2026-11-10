export interface ProviderCheckResult {
  checked: boolean;
  flagged: boolean;
  threatType?: string;
  source: string;
  details?: string;
}

export async function checkSafeBrowsing(
  url: string,
  apiKey?: string,
  timeoutMs = 4000
): Promise<ProviderCheckResult> {
  if (!apiKey) {
    return {
      checked: false,
      flagged: false,
      source: 'Google Safe Browsing',
      details: 'API Key tidak dikonfigurasi (menggunakan analisis lokal)',
    };
  }

  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(
    apiKey
  )}`;

  const body = {
    client: {
      clientId: 'scamshield-app',
      clientVersion: '1.0.0',
    },
    threatInfo: {
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }],
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return {
        checked: false,
        flagged: false,
        source: 'Google Safe Browsing',
        details: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const matches = data.matches || [];
    const flagged = matches.length > 0;
    const threatType = flagged ? matches[0].threatType : undefined;

    return {
      checked: true,
      flagged,
      threatType,
      source: 'Google Safe Browsing',
      details: flagged ? `Terdeteksi ancaman: ${threatType}` : 'Tidak tercatat di database ancaman',
    };
  } catch {
    clearTimeout(timer);
    return {
      checked: false,
      flagged: false,
      source: 'Google Safe Browsing',
      details: 'Timeout atau jaringan offline',
    };
  }
}
