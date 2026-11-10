import { ProviderCheckResult } from './safeBrowsingProvider';

const MOCK_MALICIOUS_PATTERNS = [
  'phishing-bca-login.xyz',
  'klik-bca-login.biz',
  'dana-kaget-gratis.cfd',
  'wa-undian-berhadiah.top',
  'secure-login-verify-account.tk',
  'bri-promo-hadiah.ml',
  'shopee-undian-resmi.cam',
  'rekening-dibekukan-klik.ga',
  'crypto-giveaway-binance.click',
  'bantuan-pemerintah-bansos.buzz',
  'loker-parttime-gaji-harian.rest',
  'malware-test.org',
];

export async function checkMockProvider(
  url: string,
  simulatedDelayMs = 300
): Promise<ProviderCheckResult> {
  if (simulatedDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
  }

  const lower = url.toLowerCase();
  const isMatch = MOCK_MALICIOUS_PATTERNS.some((pattern) => lower.includes(pattern));

  if (isMatch) {
    return {
      checked: true,
      flagged: true,
      threatType: 'Phishing & Rekayasa Sosial (Demo DB)',
      source: 'ScamShield Mock Database',
      details: 'Domain terdaftar pada database sampel demo ancaman aktif',
    };
  }

  return {
    checked: true,
    flagged: false,
    source: 'ScamShield Mock Database',
    details: 'Tidak ditemukan pada sampel demo database',
  };
}
