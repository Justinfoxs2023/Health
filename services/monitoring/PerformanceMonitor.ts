/**
 * @fileoverview TS 文件 PerformanceMonitor.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class PerformanceMonitor {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly alertService: AlertService,
  ) {}

  // 跟踪性能指标
  async trackMetric(metric: PerformanceMetric) {
    // 记录指标
    await this.metricsService.record(metric);

    // 检查阈值
    await this.checkThresholds(metric);
  }

  // 生成性能报告
  async generateReport(timeRange: TimeRange): Promise<PerformanceReport> {
    const metrics = await this.metricsService.query(timeRange);

    return {
      summary: this.calculateSummary(metrics),
      details: this.analyzeMetrics(metrics),
      recommendations: await this.generateRecommendations(metrics),
      timestamp: new Date(),
    };
  }

  private async checkThresholds(metric: PerformanceMetric) {
    const threshold = await this.getThreshold(metric.name);

    if (metric.value > threshold.critical) {
      await this.alertService.sendAlert({
        level: 'critical',
        metric: metric.name,
        value: metric.value,
        threshold: threshold.critical,
      });
    }
  }

  private calculateSummary(metrics: PerformanceMetric[]) {
    // 计算性能指标摘要
    return {
      avgResponseTime: this.calculateAverage(metrics, 'responseTime'),
      maxMemoryUsage: this.findMax(metrics, 'memoryUsage'),
      errorRate: this.calculateErrorRate(metrics),
      throughput: this.calculateThroughput(metrics),
    };
  }
}
