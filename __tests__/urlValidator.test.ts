import {
  sanitizeAndValidateUrl,
  extractUrlsFromText,
} from '../src/utils/urlValidator';

describe('urlValidator', () => {
  describe('sanitizeAndValidateUrl', () => {
    it('should reject empty or whitespace input', () => {
      expect(sanitizeAndValidateUrl('').isValid).toBe(false);
      expect(sanitizeAndValidateUrl('   ').isValid).toBe(false);
    });

    it('should prepend https:// if protocol is missing', () => {
      const res = sanitizeAndValidateUrl('klik-bca-login.biz');
      expect(res.isValid).toBe(true);
      expect(res.sanitizedUrl).toBe('https://klik-bca-login.biz/');
      expect(res.hostname).toBe('klik-bca-login.biz');
    });

    it('should reject dangerous protocols', () => {
      expect(sanitizeAndValidateUrl('javascript:alert(1)').isValid).toBe(false);
      expect(sanitizeAndValidateUrl('data:text/html,<script>alert(1)</script>').isValid).toBe(false);
      expect(sanitizeAndValidateUrl('file:///etc/passwd').isValid).toBe(false);
      expect(sanitizeAndValidateUrl('vbscript:msgbox("test")').isValid).toBe(false);
      expect(sanitizeAndValidateUrl('chrome://settings').isValid).toBe(false);
    });

    it('should reject invalid domain syntax', () => {
      expect(sanitizeAndValidateUrl('https://').isValid).toBe(false);
      expect(sanitizeAndValidateUrl('not a valid url').isValid).toBe(false);
    });

    it('should accept valid https and http URLs', () => {
      const httpsRes = sanitizeAndValidateUrl('https://bankmandiri.co.id/promo');
      expect(httpsRes.isValid).toBe(true);
      expect(httpsRes.protocol).toBe('https:');
      expect(httpsRes.hostname).toBe('bankmandiri.co.id');

      const httpRes = sanitizeAndValidateUrl('http://insecure-login.com');
      expect(httpRes.isValid).toBe(true);
      expect(httpRes.protocol).toBe('http:');
    });

    it('should identify IP addresses', () => {
      const ipRes = sanitizeAndValidateUrl('http://192.168.1.1/login');
      expect(ipRes.isValid).toBe(true);
      expect(ipRes.isIpAddress).toBe(true);

      const domainRes = sanitizeAndValidateUrl('https://example.com');
      expect(domainRes.isIpAddress).toBe(false);
    });

    it('should identify URL shorteners', () => {
      const shortenerRes = sanitizeAndValidateUrl('https://bit.ly/xyz123');
      expect(shortenerRes.isValid).toBe(true);
      expect(shortenerRes.isShortener).toBe(true);

      const sidRes = sanitizeAndValidateUrl('https://s.id/kupon');
      expect(sidRes.isValid).toBe(true);
      expect(sidRes.isShortener).toBe(true);
    });

    it('should calculate subdomain count', () => {
      const multiSubRes = sanitizeAndValidateUrl('https://login.secure.verify.fakebank.com');
      expect(multiSubRes.isValid).toBe(true);
      expect((multiSubRes.subdomainCount || 0) >= 2).toBe(true);
    });
  });

  describe('extractUrlsFromText', () => {
    it('should extract URLs with and without protocols', () => {
      const text = 'Selamat Anda menang undian! Cek di https://hadiah-resmi.vip/claim atau https://s.id/hadiah2026 sekarang.';
      const urls = extractUrlsFromText(text);
      expect(urls.length).toBe(2);
      expect(urls).toContain('https://hadiah-resmi.vip/claim');
      expect(urls).toContain('https://s.id/hadiah2026');
    });

    it('should return empty array for text without URLs', () => {
      expect(extractUrlsFromText('Halo selamat pagi apa kabar?')).toEqual([]);
      expect(extractUrlsFromText('')).toEqual([]);
    });
  });
});
