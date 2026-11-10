import { AnalysisResult, RiskIndicator } from '../../types';
import { extractUrlsFromText } from '../../utils/urlValidator';
import { createInputPreview } from '../../utils/redaction';
import { MESSAGE_PATTERNS } from '../../constants/scamPatterns';
import { calculateRiskLevel, clampScore, generateRecommendations, generateSummary } from './riskScoring';
import { analyzeUrl, AnalyzeUrlOptions } from './analyzeUrl';

export async function analyzeMessage(
  message: string,
  options: AnalyzeUrlOptions = {}
): Promise<AnalysisResult> {
  const trimmed = (message || '').trim();

  if (!trimmed) {
    throw new Error('Isi pesan tidak boleh kosong');
  }

  const indicators: RiskIndicator[] = [];
  const sources: string[] = ['Pemeriksaan Pola Kalimat & NLP'];
  let totalScore = 0;
  let isDemoAnalysis = false;

  // 1. Check Urgency / Threats (+15)
  const urgencyMatch = MESSAGE_PATTERNS.urgency.some((pattern) => pattern.test(trimmed));
  if (urgencyMatch) {
    indicators.push({
      id: 'urgency-threat',
      title: 'Tekanan Waktu & Ancaman Blokir',
      description: 'Pesan mengandung desakan waktu mendesak atau ancaman pemblokiran akun, teknik psikologis umum scammer.',
      severity: 'warning',
      points: 15,
      source: 'Analisis Linguistik',
    });
    totalScore += 15;
  }

  // 2. Check OTP / PIN / Password Credential Requests (+25)
  const otpMatch = MESSAGE_PATTERNS.otp.some((pattern) => pattern.test(trimmed));
  if (otpMatch) {
    indicators.push({
      id: 'otp-request',
      title: 'Permintaan Kode OTP / PIN Rahasia',
      description: 'Pesan meminta kode OTP, PIN, kata sandi, atau data kartu. Petugas resmi tidak pernah meminta kode rahasia.',
      severity: 'danger',
      points: 25,
      source: 'Deteksi Kredensial',
    });
    totalScore += 25;
  }

  // 3. Check Transfer / Upfront Fee Requests (+25)
  const transferMatch = MESSAGE_PATTERNS.transfer.some((pattern) => pattern.test(trimmed));
  if (transferMatch) {
    indicators.push({
      id: 'transfer-request',
      title: 'Permintaan Transfer / Biaya Administrasi',
      description: 'Pesan meminta transfer uang, biaya administrasi di muka, atau menjanjikan keuntungan investasi tidak wajar.',
      severity: 'danger',
      points: 25,
      source: 'Deteksi Transaksi',
    });
    totalScore += 25;
  }

  // 4. Check Fake Job Patterns (+20)
  const fakeJobMatch = MESSAGE_PATTERNS.fakeJob.some((pattern) => pattern.test(trimmed));
  if (fakeJobMatch) {
    indicators.push({
      id: 'fake-job',
      title: 'Ciri Lowongan Kerja Palsu',
      description: 'Penawaran kerja paruh waktu tanpa seleksi, iming-iming komisi klik like/subscribe, atau meminta deposit tugas.',
      severity: 'warning',
      points: 20,
      source: 'Deteksi Pola Rekrutmen',
    });
    totalScore += 20;
  }

  // 5. Check Fake Prize / Lottery (+20)
  const fakePrizeMatch = MESSAGE_PATTERNS.fakePrize.some((pattern) => pattern.test(trimmed));
  if (fakePrizeMatch) {
    indicators.push({
      id: 'fake-prize',
      title: 'Klaim Hadiah / Undian Palsu',
      description: 'Pesan mengklaim Anda memenangkan undian atau bantuan tunai tanpa pendaftaran resmi yang dapat diverifikasi.',
      severity: 'warning',
      points: 20,
      source: 'Deteksi Promosi Palsu',
    });
    totalScore += 20;
  }

  // 6. Extract and analyze embedded URLs
  const extractedUrls = extractUrlsFromText(trimmed);
  if (extractedUrls.length > 0) {
    sources.push('Pemindaian Tautan Dalam Pesan');

    for (const url of extractedUrls.slice(0, 3)) {
      try {
        const urlResult = await analyzeUrl(url, options);
        if (urlResult.isDemo) isDemoAnalysis = true;

        if (urlResult.score >= 40) {
          const addedPoints = Math.min(50, Math.round(urlResult.score * 0.6));
          indicators.push({
            id: `embedded-url-${urlResult.id}`,
            title: `Tautan Berisiko Tinggi Ditemukan`,
            description: `Pesan menyertakan tautan (${urlResult.inputPreview}) dengan skor risiko ${urlResult.score}/100 (${urlResult.level}).`,
            severity: 'danger',
            points: addedPoints,
            source: 'Analisis URL Tertaut',
          });
          totalScore += addedPoints;
        } else {
          indicators.push({
            id: `embedded-url-note-${urlResult.id}`,
            title: 'Tautan Terlampir dalam Pesan',
            description: `Tautan (${urlResult.inputPreview}) terdeteksi dan dianalisis awal.`,
            severity: 'info',
            points: 5,
            source: 'Analisis URL Tertaut',
          });
          totalScore += 5;
        }
      } catch {
        indicators.push({
          id: 'malformed-url-in-msg',
          title: 'Tautan Tidak Standar / Mencurigakan',
          description: 'Pesan memuat pola tautan yang tidak lolos validasi format standar.',
          severity: 'warning',
          points: 15,
          source: 'Validasi Tautan',
        });
        totalScore += 15;
      }
    }
  }

  const finalScore = clampScore(totalScore);
  const level = calculateRiskLevel(finalScore);
  const recommendations = generateRecommendations(level, indicators, 'message');
  const summary = generateSummary(level, 'message', indicators);

  return {
    id: `chk_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'message',
    inputPreview: createInputPreview(trimmed, 80),
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
