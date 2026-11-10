import {
  redactSensitiveData,
  createInputPreview,
} from '../src/utils/redaction';

describe('redaction', () => {
  it('should redact email addresses', () => {
    const input = 'Hubungi saya di korban.penipuan@gmail.com segera';
    expect(redactSensitiveData(input)).toBe('Hubungi saya di [REDACTED_EMAIL] segera');
  });

  it('should redact Indonesian and international phone numbers', () => {
    const input1 = 'Konfirmasi ke 081234567890 sekarang';
    expect(redactSensitiveData(input1)).toBe('Konfirmasi ke [REDACTED_PHONE] sekarang');

    const input2 = 'Kirim WA ke +6282199887766';
    expect(redactSensitiveData(input2)).toBe('Kirim WA ke [REDACTED_PHONE]');
  });

  it('should redact credit/debit card numbers', () => {
    const input = 'Nomor kartu: 4111 2222 3333 4444';
    expect(redactSensitiveData(input)).toBe('Nomor kartu: [REDACTED_CARD]');
  });

  it('should redact sensitive query parameters from URLs', () => {
    const url = 'https://fake-login.com/auth?token=secret12345&password=mysecret&user=john';
    const redacted = redactSensitiveData(url);
    expect(redacted).not.toContain('secret12345');
    expect(redacted).not.toContain('mysecret');
    expect(redacted).toContain('token=[REDACTED]');
  });

  it('should perform complete message redaction', () => {
    const raw = 'Halo user john@doe.com, kirim OTP ke 081299998888 dengan kartu 5500 0000 1234 5678!';
    const redacted = redactSensitiveData(raw);
    expect(redacted).toContain('[REDACTED_EMAIL]');
    expect(redacted).toContain('[REDACTED_PHONE]');
    expect(redacted).toContain('[REDACTED_CARD]');
    expect(redacted).not.toContain('john@doe.com');
    expect(redacted).not.toContain('081299998888');
  });

  it('should truncate preview properly', () => {
    const longText = 'A'.repeat(200);
    const preview = createInputPreview(longText, 50);
    expect(preview.length).toBeLessThanOrEqual(53); // 50 + '...'
    expect(preview.endsWith('...')).toBe(true);
  });

  it('should handle empty input safely', () => {
    expect(redactSensitiveData('')).toBe('');
    expect(createInputPreview('', 50)).toBe('');
  });
});
