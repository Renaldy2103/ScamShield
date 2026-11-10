import { ProviderCheckResult } from './safeBrowsingProvider';

/**
 * URLhaus API check (abuse.ch).
 * Free and open intelligence on malicious URLs and malware distribution.
 */
export async function checkUrlhaus(
  url: string,
  timeoutMs = 4000
): Promise<ProviderCheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const params = new URLSearchParams();
    params.append('url', url);

    const response = await fetch('https://urlhaus-api.abuse.ch/v1/url/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return {
        checked: false,
        flagged: false,
        source: 'URLhaus (abuse.ch)',
        details: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const queryStatus = data.query_status;

    if (queryStatus === 'ok') {
      const threat = data.threat || 'malware_download';
      const status = data.url_status || 'online';
      return {
        checked: true,
        flagged: true,
        threatType: threat,
        source: 'URLhaus (abuse.ch)',
        details: `Tercatat di database URLhaus (Status: ${status}, Ancaman: ${threat})`,
      };
    }

    return {
      checked: true,
      flagged: false,
      source: 'URLhaus (abuse.ch)',
      details: 'URL tidak ditemukan pada daftar malware aktif URLhaus',
    };
  } catch {
    clearTimeout(timer);
    return {
      checked: false,
      flagged: false,
      source: 'URLhaus (abuse.ch)',
      details: 'Timeout atau jaringan offline',
    };
  }
}
