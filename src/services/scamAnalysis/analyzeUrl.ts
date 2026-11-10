import { AnalysisResult, RiskIndicator } from '../../types';
import { sanitizeAndValidateUrl } from '../../utils/urlValidator';
import { createInputPreview } from '../../utils/redaction';
import { SUSPICIOUS_URL_KEYWORDS, SUSPICIOUS_TLDS } from '../../constants/scamPatterns';
import { calculateRiskLevel, clampScore, generateRecommendations, generateSummary } from './riskScoring';
import { checkMockProvider } from './mockProvider';
import { checkUrlhaus } from './urlhausProvider';
import { checkSafeBrowsing } from './safeBrowsingProvider';
import { checkThreatViaSupabaseProxy } from '../supabase/proxy';

export interface AnalyzeUrlOptions {
  forceDemo?: boolean;
  enableExternalApis?: boolean;
  googleApiKey?: string;
}

export async function analyzeUrl(
  inputUrl: string,
  options: AnalyzeUrlOptions = {}
): Promise<AnalysisResult> {
  const validation = sanitizeAndValidateUrl(inputUrl);

  if (!validation.isValid || !validation.sanitizedUrl) {
    throw new Error(validation.errorMessage || 'URL tidak valid');
  }

  const cleanUrl = validation.sanitizedUrl;
  const indicators: RiskIndicator[] = [];
  const sources: string[] = ['Analisis Heuristik Lokal'];
  let totalScore = 0;
  let isDemoAnalysis = false;

  const parsed = new URL(cleanUrl);
  const hostname = parsed.hostname.toLowerCase();
  const fullPath = (parsed.pathname + parsed.search).toLowerCase();

  // 1. Check protocol: HTTP vs HTTPS (+15)
  if (validation.protocol === 'http:') {
    indicators.push({
      id: 'no-https',
      title: 'Koneksi Tidak Terenkripsi (HTTP)',
      description: 'Situs tidak menggunakan HTTPS. Data yang dikirimkan dapat disadap di jaringan publik.',
      severity: 'warning',
      points: 15,
      source: 'Analisis Protokol',
    });
    totalScore += 15;
  }

  // 2. Check if hostname is raw IP address (+25)
  if (validation.isIpAddress) {
    indicators.push({
      id: 'ip-hostname',
      title: 'Penggunaan Alamat IP Langsung',
      description: 'URL menggunakan alamat IP alih-alih nama domain resmi, sering digunakan pada server phishing sementara.',
      severity: 'danger',
      points: 25,
      source: 'Analisis Hostname',
    });
    totalScore += 25;
  }

  // 3. Check excessive subdomains (>= 3) (+10)
  if (validation.subdomainCount && validation.subdomainCount >= 3) {
    indicators.push({
      id: 'excessive-subdomains',
      title: 'Struktur Subdomain Berlapis',
      description: `Domain memiliki ${validation.subdomainCount} tingkat subdomain, pola umum untuk mengelabui nama domain asli.`,
      severity: 'warning',
      points: 10,
      source: 'Analisis DNS',
    });
    totalScore += 10;
  }

  // 4. Check URL shortener (+10)
  if (validation.isShortener) {
    indicators.push({
      id: 'url-shortener',
      title: 'Tautan Pemendek (URL Shortener)',
      description: 'URL menggunakan layanan pemendek tautan yang menyembunyikan alamat tujuan sebenarnya.',
      severity: 'info',
      points: 10,
      source: 'Analisis Reputasi',
    });
    totalScore += 10;
  }

  // 5. Check suspicious TLD (+10)
  const matchedTld = SUSPICIOUS_TLDS.find((tld) => hostname.endsWith(tld));
  if (matchedTld) {
    indicators.push({
      id: 'suspicious-tld',
      title: `Domain Ekstensi Berisiko (${matchedTld})`,
      description: `Ekstensi domain ${matchedTld} memiliki frekuensi penyalahgunaan phishing tinggi dalam statistik keamanan siber.`,
      severity: 'warning',
      points: 10,
      source: 'Analisis TLD',
    });
    totalScore += 10;
  }

  // 6. Check suspicious keywords (+10)
  const matchedKeywords = SUSPICIOUS_URL_KEYWORDS.filter(
    (kw) => hostname.includes(kw) || fullPath.includes(kw)
  );
  if (matchedKeywords.length > 0) {
    indicators.push({
      id: 'suspicious-keywords',
      title: 'Kata Kunci Sensitif / Pancingan',
      description: `URL memuat kata sensitif (${matchedKeywords.slice(0, 3).join(', ')}), lazim dipakai memancing kredensial atau hadiah palsu.`,
      severity: 'warning',
      points: 10,
      source: 'Analisis Konten URL',
    });
    totalScore += 10;
  }

  // 7. Security provider check
  const { forceDemo, enableExternalApis = true, googleApiKey } = options;

  if (forceDemo) {
    const mockRes = await checkMockProvider(cleanUrl);
    sources.push(mockRes.source);
    isDemoAnalysis = true;
    if (mockRes.flagged) {
      indicators.push({
        id: 'provider-flagged',
        title: 'Terdeteksi Basis Data Ancaman (Demo)',
        description: mockRes.details || 'Tautan ini ditandai sebagai berbahaya pada database sampel demo.',
        severity: 'danger',
        points: 50,
        source: mockRes.source,
      });
      totalScore += 50;
    }
  } else if (enableExternalApis) {
    let externalCheckDone = false;

    // Try Supabase Edge Proxy first if available
    const proxyRes = await checkThreatViaSupabaseProxy(cleanUrl);
    if (proxyRes && proxyRes.checked) {
      externalCheckDone = true;
      sources.push(proxyRes.source);
      if (proxyRes.flagged) {
        indicators.push({
          id: 'provider-flagged',
          title: 'Terdeteksi oleh Server Keamanan',
          description: proxyRes.details || 'Tautan terdaftar sebagai ancaman aktif.',
          severity: 'danger',
          points: 50,
          source: proxyRes.source,
        });
        totalScore += 50;
      }
    }

    // If Google Safe Browsing API key exists, check it
    if (googleApiKey) {
      const gsbRes = await checkSafeBrowsing(cleanUrl, googleApiKey);
      if (gsbRes.checked) {
        externalCheckDone = true;
        sources.push(gsbRes.source);
        if (gsbRes.flagged) {
          indicators.push({
            id: 'provider-flagged-gsb',
            title: 'Google Safe Browsing Flag',
            description: gsbRes.details || 'Google Safe Browsing mengidentifikasi ancaman pada tautan ini.',
            severity: 'danger',
            points: 50,
            source: gsbRes.source,
          });
          totalScore += 50;
        }
      }
    }

    // Try URLhaus public feed
    const urlhausRes = await checkUrlhaus(cleanUrl);
    if (urlhausRes.checked) {
      externalCheckDone = true;
      sources.push(urlhausRes.source);
      if (urlhausRes.flagged) {
        indicators.push({
          id: 'provider-flagged-urlhaus',
          title: 'Database Malware URLhaus',
          description: urlhausRes.details || 'Tercatat pada repositori malware URLhaus.',
          severity: 'danger',
          points: 50,
          source: urlhausRes.source,
        });
        totalScore += 50;
      }
    }

    // If external APIs failed or unavailable, fallback to mock demo database
    if (!externalCheckDone) {
      const mockRes = await checkMockProvider(cleanUrl);
      sources.push(mockRes.source);
      isDemoAnalysis = true;
      if (mockRes.flagged) {
        indicators.push({
          id: 'provider-flagged',
          title: 'Terdeteksi Basis Data Ancaman (Demo)',
          description: mockRes.details || 'Tautan ditandai pada basis data sampel demo.',
          severity: 'danger',
          points: 50,
          source: mockRes.source,
        });
        totalScore += 50;
      }
    }
  } else {
    // Offline / local heuristic only
    const mockRes = await checkMockProvider(cleanUrl);
    sources.push(mockRes.source);
    isDemoAnalysis = true;
    if (mockRes.flagged) {
      indicators.push({
        id: 'provider-flagged',
        title: 'Terdeteksi Basis Data Ancaman (Demo)',
        description: mockRes.details || 'Tautan ditandai pada basis data sampel demo.',
        severity: 'danger',
        points: 50,
        source: mockRes.source,
      });
      totalScore += 50;
    }
  }

  const finalScore = clampScore(totalScore);
  const level = calculateRiskLevel(finalScore);
  const recommendations = generateRecommendations(level, indicators, 'url');
  const summary = generateSummary(level, 'url', indicators);

  return {
    id: `chk_url_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'url',
    inputPreview: createInputPreview(cleanUrl, 90),
    score: finalScore,
    level,
    summary,
    indicators,
    recommendations,
    sources,
    isDemo: isDemoAnalysis,
    createdAt: new Date().toISOString(),
  };
}
