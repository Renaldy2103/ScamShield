export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  errorMessage?: string;
  hostname?: string;
  protocol?: string;
  isIpAddress?: boolean;
  subdomainCount?: number;
  isShortener?: boolean;
}

const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'file:',
  'blob:',
  'vbscript:',
  'about:',
  'chrome:',
  'intent:',
  'content:',
];

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'buff.ly',
  'cutt.ly',
  'ow.ly',
  'rb.gy',
  's.id',
  'shorturl.at',
  'v.gd',
  'linktr.ee',
  'wa.me',
  'rebrand.ly',
]);

const IP_V4_REGEX = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export function sanitizeAndValidateUrl(rawInput: string): UrlValidationResult {
  const trimmed = (rawInput || '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'URL tidak boleh kosong',
    };
  }

  const lower = trimmed.toLowerCase();

  for (const blocked of BLOCKED_PROTOCOLS) {
    if (lower.startsWith(blocked)) {
      return {
        isValid: false,
        errorMessage: `Protokol berbahaya "${blocked}" ditolak`,
      };
    }
  }

  // Prepend https:// if no protocol given
  let targetUrl = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    // If it looks like another protocol like ftp://, reject
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
      return {
        isValid: false,
        errorMessage: 'Hanya protokol HTTP atau HTTPS yang diperbolehkan',
      };
    }
    targetUrl = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return {
      isValid: false,
      errorMessage: 'Format URL tidak valid',
    };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      errorMessage: 'Hanya protokol HTTP atau HTTPS yang didukung',
    };
  }

  const host = parsed.hostname.toLowerCase();
  if (!host || host.indexOf('.') === -1 && host !== 'localhost') {
    return {
      isValid: false,
      errorMessage: 'Nama host URL tidak valid atau tidak memiliki domain',
    };
  }

  // Check if IP address
  const isIpAddress = IP_V4_REGEX.test(host);

  // Check subdomain count (excluding apex domain)
  // e.g. "a.b.c.example.com" -> 5 parts -> 3 subdomains
  const parts = host.split('.');
  const subdomainCount = Math.max(0, parts.length - 2);

  // Check known shortener
  const isShortener = KNOWN_SHORTENERS.has(host);

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
    hostname: host,
    protocol: parsed.protocol,
    isIpAddress,
    subdomainCount,
    isShortener,
  };
}

export function extractUrlsFromText(text: string): string[] {
  if (!text) return [];
  // Match urls with http/https or www or standard domain names
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;
  const matches = text.match(urlRegex) || [];

  const results: string[] = [];
  for (const match of matches) {
    const cleaned = match.replace(/[.,!?;:)\]]+$/, '');
    const validation = sanitizeAndValidateUrl(cleaned);
    if (validation.isValid && validation.sanitizedUrl) {
      results.push(validation.sanitizedUrl);
    }
  }

  return Array.from(new Set(results));
}
