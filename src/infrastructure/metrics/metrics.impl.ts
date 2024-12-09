import { Metrics } from '../../types/base';

export class MetricsImpl implements Metrics {
  private metrics: Map<string, number> = new Map();

  recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  getMetric(name: string): number {
    return this.metrics.get(name) || 0;
  }

  incrementMetric(name: string): void {
    const current = this.getMetric(name);
    this.recordMetric(name, current + 1);
  }

  setMetric(name: string, value: number): void {
    this.recordMetric(name, value);
  }

  // 扩展方法
  recordTiming(name: string, duration: number, tags?: Record<string, string>): void {
    this.recordMetric(`timing.${name}`, duration);
  }

  recordGauge(name: string, value: number, tags?: Record<string, string>): void {
    this.recordMetric(`gauge.${name}`, value);
  }
} 