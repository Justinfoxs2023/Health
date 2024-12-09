export interface AnalysisResult {
  trends: HealthTrend[];
  risks: HealthRisk[];
  advice: HealthAdvice[];
  timestamp: Date;
}

export interface HealthTrend {
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  period: string;
  confidence: number;
}

export interface HealthRisk {
  type: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  factors: string[];
  recommendations: string[];
}

export interface HealthAdvice {
  category: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actions: string[];
  expectedOutcomes: string[];
  timeframe: string;
} 