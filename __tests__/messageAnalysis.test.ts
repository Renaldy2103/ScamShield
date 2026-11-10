import { analyzeMessage } from '../src/services/scamAnalysis/analyzeMessage';

describe('analyzeMessage', () => {
  it('should throw error for empty message', async () => {
    await expect(analyzeMessage('')).rejects.toThrow('Isi pesan tidak boleh kosong');
    await expect(analyzeMessage('   ')).rejects.toThrow('Isi pesan tidak boleh kosong');
  });

  it('should detect OTP / PIN theft requests', async () => {
    const message = 'Akun Bank Anda terancam diblokir. Segera kirimkan kode OTP 6 digit dan nomor kartu ATM Anda ke nomor ini.';
    const result = await analyzeMessage(message, { forceDemo: true });

    expect(result.score).toBeGreaterThanOrEqual(40);
    const hasOtpIndicator = result.indicators.some((i) => i.id === 'otp-request');
    const hasUrgencyIndicator = result.indicators.some((i) => i.id === 'urgency-threat');
    expect(hasOtpIndicator).toBe(true);
    expect(hasUrgencyIndicator).toBe(true);
  });

  it('should detect fake job / recruitment scam pattern', async () => {
    const message = 'Halo kak, kami mencari staf part time online hanya like video YouTube dan follow IG, komisi 500rb per hari tanpa seleksi cv!';
    const result = await analyzeMessage(message, { forceDemo: true });

    expect(result.indicators.some((i) => i.id === 'fake-job')).toBe(true);
    expect(result.level).not.toBe('safe-indicative');
  });

  it('should detect fake prize / lottery scam', async () => {
    const message = 'Selamat! Nomor Anda terpilih pemenang undian berhadiah cek tunai Rp 75.000.000 dari gebyar undian resmi.';
    const result = await analyzeMessage(message, { forceDemo: true });

    expect(result.indicators.some((i) => i.id === 'fake-prize')).toBe(true);
  });

  it('should extract and analyze embedded URLs in the message', async () => {
    const message = 'PENTING: Verifikasi akun BCA Anda segera di https://klik-bca-login.biz/auth sebelum dibekukan!';
    const result = await analyzeMessage(message, { forceDemo: true });

    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.indicators.some((i) => i.id.startsWith('embedded-url-'))).toBe(true);
  });

  it('should rate benign conversational message as safe-indicative', async () => {
    const message = 'Halo Budi, nanti siang kita jadi makan bareng di kantin jam 12?';
    const result = await analyzeMessage(message, { forceDemo: true });

    expect(result.score).toBe(0);
    expect(result.level).toBe('safe-indicative');
    expect(result.indicators.length).toBe(0);
  });
});
