import { RiskLevel, RiskIndicator, CheckType } from '../../types';

export function calculateRiskLevel(score: number): RiskLevel {
  const clamped = Math.max(0, Math.min(100, score));
  if (clamped < 20) return 'safe-indicative';
  if (clamped < 40) return 'low';
  if (clamped < 60) return 'medium';
  if (clamped < 80) return 'high';
  return 'critical';
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateRecommendations(
  level: RiskLevel,
  indicators: RiskIndicator[],
  type: CheckType
): string[] {
  const recommendations: string[] = [];
  const indicatorIds = new Set(indicators.map((i) => i.id));

  if (level === 'critical' || level === 'high') {
    if (indicatorIds.has('otp-request')) {
      recommendations.push(
        'JANGAN PERNAH membagikan kode OTP, PIN, password, atau CVV kepada siapa pun, termasuk pihak yang mengaku petugas resmi.'
      );
    }
    if (indicatorIds.has('transfer-request')) {
      recommendations.push(
        'TOLAK permintaan transfer uang atau biaya administrasi. Lembaga resmi tidak meminta transfer ke rekening perorangan.'
      );
    }
    if (type === 'url' || indicatorIds.has('provider-flagged')) {
      recommendations.push(
        'JANGAN login, memasukkan data pribadi, atau mengunduh file apa pun melalui tautan ini.'
      );
    }
    recommendations.push(
      'Konfirmasi langsung melalui saluran resmi terverifikasi (call center resmi / aplikasi resmi).'
    );
    recommendations.push(
      'Laporkan nomor / pengirim / link ini ke platform terkait (WhatsApp, aduankonten.id, atau patrolisiber.id).'
    );
  } else if (level === 'medium') {
    recommendations.push(
      'Periksa kembali alamat domain dengan teliti sebelum melanjutkan.'
    );
    recommendations.push(
      'Hindari memasukkan informasi perbankan atau data sensitif pada situs ini.'
    );
    recommendations.push(
      'Bandingkan informasi dengan akun media sosial atau situs resmi yang bercentang biru.'
    );
  } else if (level === 'low') {
    recommendations.push(
      'Tingkat risiko relatif rendah, namun tetap berhati-hati terhadap perubahan permintaan data di masa mendatang.'
    );
    recommendations.push(
      'Pastikan ikon gembok HTTPS aktif dan sertifikat situs terverifikasi.'
    );
  } else {
    recommendations.push(
      'Tidak ditemukan indikator ancaman langsung pada saat pemeriksaan ini.'
    );
    recommendations.push(
      'Catatan: Hasil bersifat indikatif. Kejahatan siber terus berkembang, selalu verifikasi identitas lawan bicara.'
    );
  }

  // Deduplicate and return at least 2 recommendations
  return Array.from(new Set(recommendations));
}

export function generateSummary(level: RiskLevel, type: CheckType, indicators: RiskIndicator[]): string {
  if (indicators.length === 0 || level === 'safe-indicative') {
    return `${type === 'url' ? 'Tautan' : 'Pesan'} tidak menunjukkan pola penipuan umum yang terdeteksi saat ini. Tetap waspada.`;
  }

  const highestSeverity = indicators.some((i) => i.severity === 'danger')
    ? 'bahaya tinggi'
    : 'perhatian khusus';

  return `Ditemukan ${indicators.length} indikator kecurigaan berbobot ${highestSeverity}. Penilaian menunjukkan kategori ${level.replace('-', ' ')}.`;
}
