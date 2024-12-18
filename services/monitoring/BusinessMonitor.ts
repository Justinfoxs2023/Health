/**
 * @fileoverview TS 文件 BusinessMonitor.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class BusinessMonitor {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly notificationService: NotificationService,
  ) {}

  // 监控业务指标
  async trackBusinessMetric(metric: BusinessMetric) {
    // 记录业务指标
    await this.analyticsService.track(metric);

    // 分析异常
    await this.analyzeAnomaly(metric);
  }

  // 生成业务报告
  async generateBusinessReport(timeRange: TimeRange): Promise<BusinessReport> {
    const metrics = await this.analyticsService.query(timeRange);

    return {
      userMetrics: this.analyzeUserMetrics(metrics),
      healthMetrics: this.analyzeHealthMetrics(metrics),
      trends: await this.analyzeTrends(metrics),
      recommendations: this.generateBusinessRecommendations(metrics),
    };
  }

  private async analyzeAnomaly(metric: BusinessMetric) {
    const isAnomaly = await this.analyticsService.detectAnomaly(metric);

    if (isAnomaly) {
      await this.notificationService.notify({
        level: 'warning',
        title: 'Business Anomaly Detected',
        message: `Anomaly detected in ${metric.name}`,
      });
    }
  }

  private analyzeUserMetrics(metrics: BusinessMetric[]) {
    return {
      activeUsers: this.calculateActiveUsers(metrics),
      userEngagement: this.calculateEngagement(metrics),
      userRetention: this.calculateRetention(metrics),
    };
  }
}
