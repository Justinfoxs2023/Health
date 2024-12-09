import { MetricsCollector } from './MetricsCollector';
import { AlertManager } from './AlertManager';
import { LogManager } from './LogManager';

export class PerformanceMonitor {
  private metricsCollector: MetricsCollector;
  private alertManager: AlertManager;
  private logManager: LogManager;

  constructor() {
    this.metricsCollector = new MetricsCollector();
    this.alertManager = new AlertManager();
    this.logManager = new LogManager();
  }

  // 监控API性能
  async monitorApiPerformance() {
    const metrics = await this.metricsCollector.collectApiMetrics();
    
    if (metrics.responseTime > 1000) {
      await this.alertManager.sendAlert({
        level: 'warning',
        message: 'API response time exceeds 1s'
      });
    }

    await this.logManager.logMetrics('api_performance', metrics);
  }

  // 监控资源使用
  async monitorResourceUsage() {
    const usage = await this.metricsCollector.collectResourceMetrics();
    
    if (usage.memory > 80) {
      await this.alertManager.sendAlert({
        level: 'critical',
        message: 'High memory usage detected'
      });
    }

    await this.logManager.logMetrics('resource_usage', usage);
  }

  // 监控错误率
  async monitorErrorRate() {
    const errorRate = await this.metricsCollector.collectErrorMetrics();
    
    if (errorRate > 5) {
      await this.alertManager.sendAlert({
        level: 'error',
        message: 'High error rate detected'
      });
    }

    await this.logManager.logMetrics('error_rate', { rate: errorRate });
  }
} 