import { AlertManager } from './AlertManager';
import { DashboardGenerator } from './DashboardGenerator';
import { Injectable } from '@nestjs/common';
import { MetricsCollector } from './MetricsCollector';

@Injectable()
export class MonitoringDashboardService {
  constructor(
    private readonly metricsCollector: MetricsCollector,
    private readonly alertManager: AlertManager,
    private readonly dashboardGenerator: DashboardGenerator,
  ) {}

  /** 收集系统指标 */
  async collectMetrics() {
    return this.metricsCollector.collect({
      system: true,
      application: true,
      business: true,
    });
  }

  /** 生成监控面板 */
  async generateDashboard(config: any) {
    const metrics = await this.collectMetrics();
    return this.dashboardGenerator.generate(metrics, config);
  }

  /** 配置告警规则 */
  async configureAlerts(rules: any) {
    return this.alertManager.configureRules(rules);
  }

  /** 处理告警事件 */
  async handleAlert(alert: any) {
    return this.alertManager.handleAlert(alert);
  }

  /** 性能分析 */
  async analyzePerformance(timeRange: any) {
    const metrics = await this.metricsCollector.getHistoricalData(timeRange);
    return this.dashboardGenerator.analyzePerformance(metrics);
  }

  /** 资源使用监控 */
  async monitorResources() {
    return this.metricsCollector.getResourceUsage();
  }

  /** 服务健康检查 */
  async checkServiceHealth() {
    return this.metricsCollector.checkHealth();
  }

  /** 自定义仪表板 */
  async customizeDashboard(layout: any) {
    return this.dashboardGenerator.customize(layout);
  }

  /** 导出监控报告 */
  async exportReport(timeRange: any, format: string) {
    const data = await this.metricsCollector.getHistoricalData(timeRange);
    return this.dashboardGenerator.exportReport(data, format);
  }

  /** 告警统计分析 */
  async analyzeAlerts(timeRange: any) {
    return this.alertManager.analyze(timeRange);
  }

  /** 监控数据存储 */
  async storeMetrics(metrics: any) {
    return this.metricsCollector.store(metrics);
  }

  /** 实时监控更新 */
  async enableRealTimeMonitoring(config: any) {
    return this.dashboardGenerator.enableRealTime(config);
  }

  /** SLA监控 */
  async monitorSLA() {
    return this.metricsCollector.calculateSLA();
  }
}
