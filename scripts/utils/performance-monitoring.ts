import { PerformanceMonitor } from '../interfaces/performance.interface';
import { MetricData } from '../types/metrics';
import * as os from 'os';

export class PerformanceMonitorImpl implements PerformanceMonitor {
  async collectMetrics(): Promise<MetricData[]> {
    return [
      {
        name: 'cpu',
        value: os.loadavg()[0],
        threshold: 80,
      },
      {
        name: 'memory',
        value: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
        threshold: 90,
      },
      // 其他指标...
    ];
  }

  async getMetricsSummary(): Promise<{ issues: string[] }> {
    const metrics = await this.collectMetrics();
    const issues = metrics
      .filter(metric => metric.value > metric.threshold)
      .map(metric => `${metric.name} 超出阈值: ${metric.value}% > ${metric.threshold}%`);
    
    return { issues };
  }

  async analyzeMetrics(): Promise<void> {
    const metrics = await this.collectMetrics();
    metrics.forEach(metric => {
      if (metric.value > metric.threshold) {
        console.warn(`性能警告: ${metric.name} 使用率过高 (${metric.value}%)`);
      }
    });
  }
} 