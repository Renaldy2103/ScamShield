import {
  calculateRiskLevel,
  clampScore,
  generateRecommendations,
  generateSummary,
} from '../src/services/scamAnalysis/riskScoring';
import { RiskIndicator } from '../src/types';

describe('riskScoring', () => {
  describe('clampScore', () => {
    it('should clamp scores within 0 to 100', () => {
      expect(clampScore(-20)).toBe(0);
      expect(clampScore(0)).toBe(0);
      expect(clampScore(45.6)).toBe(46);
      expect(clampScore(100)).toBe(100);
      expect(clampScore(150)).toBe(100);
    });
  });

  describe('calculateRiskLevel', () => {
    it('should assign correct RiskLevel categories', () => {
      expect(calculateRiskLevel(0)).toBe('safe-indicative');
      expect(calculateRiskLevel(19)).toBe('safe-indicative');
      expect(calculateRiskLevel(20)).toBe('low');
      expect(calculateRiskLevel(39)).toBe('low');
      expect(calculateRiskLevel(40)).toBe('medium');
      expect(calculateRiskLevel(59)).toBe('medium');
      expect(calculateRiskLevel(60)).toBe('high');
      expect(calculateRiskLevel(79)).toBe('high');
      expect(calculateRiskLevel(80)).toBe('critical');
      expect(calculateRiskLevel(100)).toBe('critical');
    });
  });

  describe('generateRecommendations', () => {
    it('should generate critical recommendations for critical level with OTP request', () => {
      const indicators: RiskIndicator[] = [
        {
          id: 'otp-request',
          title: 'Permintaan OTP',
          description: 'Pesan meminta kode OTP',
          severity: 'danger',
          points: 30,
        },
      ];
      const recs = generateRecommendations('critical', indicators, 'message');
      expect(recs.some((r) => r.includes('JANGAN PERNAH membagikan kode OTP'))).toBe(true);
      expect(recs.length).toBeGreaterThanOrEqual(2);
    });

    it('should generate safe recommendations for safe-indicative level', () => {
      const recs = generateRecommendations('safe-indicative', [], 'url');
      expect(recs.some((r) => r.includes('indikatif'))).toBe(true);
      expect(recs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('generateSummary', () => {
    it('should generate summary for safe scan', () => {
      const summary = generateSummary('safe-indicative', 'url', []);
      expect(summary).toContain('tidak menunjukkan pola');
    });

    it('should generate summary for flagged scan', () => {
      const indicators: RiskIndicator[] = [
        {
          id: 'test-flag',
          title: 'Uji Bahaya',
          description: 'Deskripsi uji',
          severity: 'danger',
          points: 25,
        },
      ];
      const summary = generateSummary('high', 'url', indicators);
      expect(summary).toContain('Ditemukan 1 indikator');
    });
  });
});
