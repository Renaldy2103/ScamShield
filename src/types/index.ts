export type RiskLevel =
  | 'safe-indicative'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type CheckType = 'url' | 'message';

export type RiskIndicator = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  points: number;
  source?: string;
};

export type AnalysisResult = {
  id: string;
  type: CheckType;
  inputPreview: string;
  score: number;
  level: RiskLevel;
  summary: string;
  indicators: RiskIndicator[];
  recommendations: string[];
  sources: string[];
  isDemo: boolean;
  createdAt: string;
};

export type AppTheme = 'dark' | 'light' | 'system';

export type UserSettings = {
  theme: AppTheme;
  savePreviews: boolean;
  enableExternalApis: boolean;
  forceDemoMode: boolean;
};

export type SecurityArticle = {
  id: string;
  title: string;
  category: 'phishing' | 'otp' | 'loker' | 'marketplace' | 'domain' | 'pelaporan' | 'tindakan';
  summary: string;
  tips: string[];
  warningSigns: string[];
  actionSteps: string[];
};
