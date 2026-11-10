import { checkUrlhaus } from '../src/services/scamAnalysis/urlhausProvider';
import { checkSafeBrowsing } from '../src/services/scamAnalysis/safeBrowsingProvider';
import { analyzeUrl } from '../src/services/scamAnalysis/analyzeUrl';

describe('API handling & Offline resilience', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('URLhaus provider', () => {
    it('should handle API rate limit (HTTP 429)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 429,
      } as unknown as Response);

      const result = await checkUrlhaus('https://example.com');
      expect(result.checked).toBe(false);
      expect(result.flagged).toBe(false);
      expect(result.details).toContain('HTTP 429');
    });

    it('should handle API timeout or offline network drop', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network request failed'));

      const result = await checkUrlhaus('https://example.com', 100);
      expect(result.checked).toBe(false);
      expect(result.flagged).toBe(false);
      expect(result.details).toContain('offline');
    });
  });

  describe('Google Safe Browsing provider', () => {
    it('should handle missing API key gracefully', async () => {
      const result = await checkSafeBrowsing('https://example.com');
      expect(result.checked).toBe(false);
      expect(result.details).toContain('API Key tidak dikonfigurasi');
    });

    it('should handle timeout or offline error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Timeout'));

      const result = await checkSafeBrowsing('https://example.com', 'test-key', 50);
      expect(result.checked).toBe(false);
      expect(result.flagged).toBe(false);
      expect(result.details).toContain('offline');
    });
  });

  describe('analyzeUrl offline mode', () => {
    it('should not crash when offline, evaluate local heuristics, and fallback to mock dataset', async () => {
      // Simulate network completely down
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error (offline)'));

      // Check a mock phishing URL while offline
      const result = await analyzeUrl('http://192.168.1.1/klikbca-login/verify.php?token=123');

      expect(result.score).toBeGreaterThan(0);
      expect(result.isDemo).toBe(true);
      // Local heuristics checked:
      // HTTP (+15), IP address (+25), suspicious keywords login/verify (+10)
      expect(result.indicators.some((i) => i.id === 'no-https')).toBe(true);
      expect(result.indicators.some((i) => i.id === 'ip-hostname')).toBe(true);
      expect(result.indicators.some((i) => i.id === 'suspicious-keywords')).toBe(true);
      expect(result.sources.length).toBeGreaterThan(0);
    });
  });
});
