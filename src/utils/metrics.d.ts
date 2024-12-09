export interface Metrics {
  recordMetric(name: string, value: number): void;
  getMetric(name: string): number;
  incrementMetric(name: string): void;
  setMetric(name: string, value: number): void;
} 