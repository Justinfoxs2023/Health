import { AlertManager } from './AlertManager';
import { ConfigService } from '../config/ConfigurationManager';
import { HealthCheck } from './HealthCheck';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from './MetricsCollector';

export interface IServiceMetrics {
  /** health 的描述 */
    health: {
    status: healthy  degraded  unhealthy;
    lastCheck: Date;
    details: Recordstring, any;
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      disk: number;
    };
  };
  business: {
    activeUsers: number;
    transactionCount: number;
    successRate: number;
  };
}

@Injectable()
export class ServiceMonitoringSystem {
  private readonly checkInterval: number;
  private readonly services: Set<string>;

  constructor(
    private readonly logger: Logger,
    private readonly metricsCollector: MetricsCollector,
    private readonly alertManager: AlertManager,
    private readonly healthCheck: HealthCheck,
    private readonly config: ConfigService,
  ) {
    this.checkInterval = this.config.get('monitoring.checkInterval') || 30000;
    this.services = new Set();
  }

  async startMonitoring(): Promise<void> {
    // 启动定期监控
    setInterval(() => this.monitorAllServices(), this.checkInterval);
  }

  async registerService(serviceName: string): Promise<void> {
    this.services.add(serviceName);
    await this.initializeServiceMonitoring(serviceName);
  }

  private async monitorAllServices(): Promise<void> {
    for (const service of this.services) {
      try {
        const metrics = await this.collectServiceMetrics(service);
        await this.processMetrics(service, metrics);
      } catch (error) {
        this.logger.error(`监控服务 ${service} 失败`, error);
      }
    }
  }

  private async initializeServiceMonitoring(service: string): Promise<void> {
    // 初始化服务监控配置
    await this.metricsCollector.initializeMetrics(service);
    await this.healthCheck.registerService(service);
    await this.alertManager.setupAlerts(service);
  }

  private async collectServiceMetrics(service: string): Promise<IServiceMetrics> {
    // 收集服务指标
    const health = await this.healthCheck.checkService(service);
    const performance = await this.metricsCollector.collectPerformanceMetrics(service);
    const business = await this.metricsCollector.collectBusinessMetrics(service);

    return {
      health,
      performance,
      business,
    };
  }

  private async processMetrics(service: string, metrics: IServiceMetrics): Promise<void> {
    // 处理和分析指标
    await this.analyzeMetrics(service, metrics);
    await this.storeMetrics(service, metrics);
    await this.checkAlerts(service, metrics);
  }

  private async analyzeMetrics(service: string, metrics: IServiceMetrics): Promise<void> {
    // 分析服务指标
    if (metrics.health.status !== 'healthy') {
      await this.handleUnhealthyService(service, metrics);
    }

    if (metrics.performance.errorRate > this.config.get('monitoring.errorRateThreshold')) {
      await this.handleHighErrorRate(service, metrics);
    }

    if (metrics.performance.responseTime > this.config.get('monitoring.responseTimeThreshold')) {
      await this.handleSlowResponse(service, metrics);
    }
  }

  private async storeMetrics(service: string, metrics: IServiceMetrics): Promise<void> {
    // 存储监控指标
    await this.metricsCollector.storeMetrics(service, metrics);
  }

  private async checkAlerts(service: string, metrics: IServiceMetrics): Promise<void> {
    // 检查是否需要触发告警
    await this.alertManager.checkAlerts(service, metrics);
  }

  private async handleUnhealthyService(service: string, metrics: IServiceMetrics): Promise<void> {
    // 处理不健康的服务
    this.logger.warn(`服务 ${service} 不健康`, metrics.health);
    await this.alertManager.sendAlert({
      service,
      level: 'critical',
      message: `服务 ${service} 状态异常`,
      details: metrics.health,
    });
  }

  private async handleHighErrorRate(service: string, metrics: IServiceMetrics): Promise<void> {
    // 处理高错误率
    this.logger.warn(`服务 ${service} 错误率过高`, {
      errorRate: metrics.performance.errorRate,
    });
    await this.alertManager.sendAlert({
      service,
      level: 'warning',
      message: `服务 ${service} 错误率异常`,
      details: { errorRate: metrics.performance.errorRate },
    });
  }

  private async handleSlowResponse(service: string, metrics: IServiceMetrics): Promise<void> {
    // 处理响应慢的情况
    this.logger.warn(`服务 ${service} 响应时间过长`, {
      responseTime: metrics.performance.responseTime,
    });
    await this.alertManager.sendAlert({
      service,
      level: 'warning',
      message: `服务 ${service} 响应时间异常`,
      details: { responseTime: metrics.performance.responseTime },
    });
  }
}
