import { MetricData } from '../types/metrics';

export interface PerformanceMonitor {
  collectMetrics(): Promise<MetricData[]>;
  getMetricsSummary(): Promise<{ issues: string[] }>;
  analyzeMetrics(): Promise<void>;
}
