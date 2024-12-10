// 添加通用类型定义
export interface TimeRange {
  start: Date;
  end: Date;
  interval?: 'hour' | 'day' | 'week' | 'month';
}

export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  source: string;
}

export interface AnalysisResult<T> {
  data: T;
  metadata: {
    analyzedAt: Date;
    duration: number;
    version: string;
  };
} 