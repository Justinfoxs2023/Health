import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

interface ITimer {
  /** start 的描述 */
  start: number;
  /** end 的描述 */
  end: number;
}

interface IMetricValue {
  /** value 的描述 */
  value: number;
  /** timestamp 的描述 */
  timestamp: number;
  /** tags 的描述 */
  tags: Recordstring /** string 的描述 */;
  /** string 的描述 */
  string;
}

@Injectable()
export class MetricsService {
  private metrics: Map<string, IMetricValue[]> = new Map();
  private readonly retentionPeriod: number;

  constructor(private readonly config: ConfigService) {
    this.retentionPeriod = this.config.get('METRICS_RETENTION_PERIOD') || 86400000; // 默认1天
    this.startCleanupInterval();
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 3600000); // 每小时清理一次
  }

  private cleanupOldMetrics(): void {
    const now = Date.now();
    for (const [key, values] of this.metrics.entries()) {
      const filteredValues = values.filter(value => now - value.timestamp < this.retentionPeriod);
      this.metrics.set(key, filteredValues);
    }
  }

  startTimer(operation: string): ITimer {
    const start = Date.now();
    return {
      start,
      end: () => {
        const duration = Date.now() - start;
        this.recordMetric(`${operation}_duration`, duration);
        return duration;
      },
    };
  }

  increment(metric: string, tags?: Record<string, string>): void {
    this.recordMetric(metric, 1, tags);
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metricValue: IMetricValue = {
      value,
      timestamp: Date.now(),
      tags,
    };

    const existingValues = this.metrics.get(name) || [];
    existingValues.push(metricValue);
    this.metrics.set(name, existingValues);
  }

  getMetrics(metricName?: string): Record<string, IMetricValue[]> {
    if (metricName) {
      const values = this.metrics.get(metricName);
      return values ? { [metricName]: values } : {};
    }
    return Object.fromEntries(this.metrics.entries());
  }

  getMetricsSummary(): Record<
    string,
    { count: number; sum: number; avg: number; max: number; min: number }
  > {
    const summary: Record<
      string,
      { count: number; sum: number; avg: number; max: number; min: number }
    > = {};

    for (const [name, values] of this.metrics.entries()) {
      if (values.length === 0) continue;

      const metricValues = values.map(v => v.value);
      const count = metricValues.length;
      const sum = metricValues.reduce((a, b) => a + b, 0);
      const avg = sum / count;
      const max = Math.max(...metricValues);
      const min = Math.min(...metricValues);

      summary[name] = { count, sum, avg, max, min };
    }

    return summary;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}
