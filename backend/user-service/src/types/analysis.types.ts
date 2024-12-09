export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface AnalysisMetric {
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface HealthTrend {
  timestamp: string;
  metrics: Record<string, number[]>;
}

export interface AnalysisResult {
  trends: HealthTrend[];
  metrics: AnalysisMetric[];
  summary: {
    score: number;
    recommendations: string[];
  };
}

export interface AnalysisOptions {
  timeRange: TimeRange;
  metrics?: string[];
  includeRecommendations?: boolean;
} 