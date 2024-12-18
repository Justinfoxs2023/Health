import { AlertManager } from './AlertManager';
import { ConfigService } from '@nestjs/config';
import { ConfigurationManager } from '../config/ConfigurationManager';
import { EventEmitter } from '../events/event-emitter.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from './metrics.service';
import { PerformanceOptimizer } from '../optimization/PerformanceOptimizer';
import { SecurityAuditor } from '../security/SecurityAuditor';

interface ISystemStatus {
  /** timestamp 的描述 */
    timestamp: Date;
  /** health 的描述 */
    health: {
    status: healthy  warning  critical;
    services: {
      key: string: {
        status: up  down  degraded;
        lastCheck: Date;
        metrics: any;
      };
    };
  };
  performance: {
    cpu: any;
    memory: any;
    io: any;
    network: any;
  };
  security: {
    events: any[];
    threats: any[];
    audits: any[];
  };
  alerts: {
    active: any[];
    recent: any[];
    statistics: any;
  };
}

@Injectable()
export class DashboardService {
  private systemStatus: ISystemStatus;
  private readonly updateInterval: number;

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter,
    private readonly performanceOptimizer: PerformanceOptimizer,
    private readonly securityAuditor: SecurityAuditor,
    private readonly configManager: ConfigurationManager,
    private readonly alertManager: AlertManager,
  ) {
    this.updateInterval = this.config.get('DASHBOARD_UPDATE_INTERVAL') || 30000;
    this.initialize();
  }

  private async initialize() {
    try {
      await this.setupEventListeners();
      await this.startStatusUpdates();
      this.logger.info('监控仪表板服务初始化完成');
    } catch (error) {
      this.logger.error('监控仪表板服务初始化失败', error);
      throw error;
    }
  }

  private async setupEventListeners(): Promise<void> {
    // 监听性能事件
    this.eventEmitter.on('performance:update', async data => {
      await this.updatePerformanceStatus(data);
    });

    // 监听安全事件
    this.eventEmitter.on('security:event', async data => {
      await this.updateSecurityStatus(data);
    });

    // 监听配置变更
    this.eventEmitter.on('config:updated', async data => {
      await this.refreshSystemStatus();
    });

    // 监听告警事件
    this.eventEmitter.on('alert:triggered', async data => {
      await this.updateAlertStatus(data);
    });
  }

  private async startStatusUpdates(): Promise<void> {
    setInterval(async () => {
      try {
        await this.refreshSystemStatus();
      } catch (error) {
        this.logger.error('状态更新失败', error);
      }
    }, this.updateInterval);
  }

  private async refreshSystemStatus(): Promise<void> {
    try {
      const [performanceMetrics, securityEvents, activeAlerts] = await Promise.all([
        this.collectPerformanceMetrics(),
        this.collectSecurityEvents(),
        this.collectAlertStatus(),
      ]);

      this.systemStatus = {
        timestamp: new Date(),
        health: await this.assessSystemHealth(),
        performance: performanceMetrics,
        security: securityEvents,
        alerts: activeAlerts,
      };

      this.eventEmitter.emit('dashboard:updated', {
        timestamp: this.systemStatus.timestamp,
        status: this.systemStatus.health.status,
      });
    } catch (error) {
      this.logger.error('刷新系统状态失败', error);
      throw error;
    }
  }

  private async assessSystemHealth(): Promise<any> {
    try {
      const services = {};
      const serviceStatuses = await this.checkServicesHealth();

      for (const [service, status] of Object.entries(serviceStatuses)) {
        services[service] = {
          status: status.status,
          lastCheck: new Date(),
          metrics: status.metrics,
        };
      }

      // 评估整体健康状态
      const overallStatus = this.calculateOverallHealth(services);

      return {
        status: overallStatus,
        services,
      };
    } catch (error) {
      this.logger.error('评估系统健康状态失败', error);
      throw error;
    }
  }

  private async checkServicesHealth(): Promise<any> {
    try {
      const checks = {
        performance: await this.checkPerformanceHealth(),
        security: await this.checkSecurityHealth(),
        config: await this.checkConfigHealth(),
        alerts: await this.checkAlertHealth(),
      };

      return checks;
    } catch (error) {
      this.logger.error('检查服务健康状态失败', error);
      throw error;
    }
  }

  private calculateOverallHealth(services: any): 'healthy' | 'warning' | 'critical' {
    const statuses = Object.values(services).map(s => s.status);

    if (statuses.includes('down')) {
      return 'critical';
    }
    if (statuses.includes('degraded')) {
      return 'warning';
    }
    return 'healthy';
  }

  private async collectPerformanceMetrics(): Promise<any> {
    try {
      const metrics = await this.performanceOptimizer.getPerformanceReport('system');
      return {
        cpu: metrics.cpu,
        memory: metrics.memory,
        io: metrics.io,
        network: metrics.network,
      };
    } catch (error) {
      this.logger.error('收集性能指标失败', error);
      throw error;
    }
  }

  private async collectSecurityEvents(): Promise<any> {
    try {
      const report = await this.securityAuditor.generateSecurityReport();
      return {
        events: report.events,
        threats: report.threats,
        audits: report.audits,
      };
    } catch (error) {
      this.logger.error('收集安全事件失败', error);
      throw error;
    }
  }

  private async collectAlertStatus(): Promise<any> {
    try {
      const activeAlerts = await this.alertManager.getActiveAlerts();
      return {
        active: activeAlerts,
        recent: await this.getRecentAlerts(),
        statistics: await this.getAlertStatistics(),
      };
    } catch (error) {
      this.logger.error('收集告警状态失败', error);
      throw error;
    }
  }

  private async checkPerformanceHealth(): Promise<any> {
    try {
      const metrics = await this.performanceOptimizer.getPerformanceReport('system');
      const status = this.evaluatePerformanceHealth(metrics);
      return {
        status,
        metrics,
      };
    } catch (error) {
      return {
        status: 'down',
        metrics: null,
      };
    }
  }

  private async checkSecurityHealth(): Promise<any> {
    try {
      const report = await this.securityAuditor.generateSecurityReport();
      const status = this.evaluateSecurityHealth(report);
      return {
        status,
        metrics: report.summary,
      };
    } catch (error) {
      return {
        status: 'down',
        metrics: null,
      };
    }
  }

  private async checkConfigHealth(): Promise<any> {
    try {
      await this.configManager.validateDependencies();
      return {
        status: 'up',
        metrics: {
          lastCheck: new Date(),
        },
      };
    } catch (error) {
      return {
        status: 'down',
        metrics: null,
      };
    }
  }

  private async checkAlertHealth(): Promise<any> {
    try {
      const activeAlerts = await this.alertManager.getActiveAlerts();
      const status = this.evaluateAlertHealth(activeAlerts);
      return {
        status,
        metrics: {
          activeCount: activeAlerts.length,
        },
      };
    } catch (error) {
      return {
        status: 'down',
        metrics: null,
      };
    }
  }

  private evaluatePerformanceHealth(metrics: any): 'up' | 'down' | 'degraded' {
    if (metrics.cpu.usage > 90 || metrics.memory.used > 90) {
      return 'degraded';
    }
    return 'up';
  }

  private evaluateSecurityHealth(report: any): 'up' | 'down' | 'degraded' {
    if (report.threats.length > 0) {
      return 'degraded';
    }
    return 'up';
  }

  private evaluateAlertHealth(alerts: any[]): 'up' | 'down' | 'degraded' {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      return 'degraded';
    }
    return 'up';
  }

  // 公共API
  async getSystemStatus(): Promise<ISystemStatus> {
    return this.systemStatus;
  }

  async getServiceHealth(serviceName: string): Promise<any> {
    return this.systemStatus?.health?.services[serviceName];
  }

  async getPerformanceStatus(): Promise<any> {
    return this.systemStatus?.performance;
  }

  async getSecurityStatus(): Promise<any> {
    return this.systemStatus?.security;
  }

  async getAlertStatus(): Promise<any> {
    return this.systemStatus?.alerts;
  }

  private async getRecentAlerts(): Promise<any[]> {
    // 实现获取最近告警的逻辑
    return [];
  }

  private async getAlertStatistics(): Promise<any> {
    // 实现获取告警统计的逻辑
    return {};
  }
}
