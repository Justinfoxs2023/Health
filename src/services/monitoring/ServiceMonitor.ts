import { ConfigService } from '@nestjs/config';
import { EventEmitter } from '../events/event-emitter.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from './metrics.service';
import { ServiceIntegrationConfig, IServiceConfig } from '../integration/service-integration.config';

interface IHealthStatus {
  /** serviceId 的描述 */
    serviceId: string;
  /** status 的描述 */
    status: healthy  degraded  unhealthy;
  lastCheck: Date;
  metrics: {
    responseTime: number;
    errorRate: number;
    successRate: number;
    throughput: number;
  };
  issues?: Array<{
    type: string;
    message: string;
    timestamp: Date;
  }>;
}

interface IAlertConfig {
  /** type 的描述 */
    type: error_rate  response_time  throughput  availability;
  threshold: number;
  window: number;
  severity: low  medium  high  critical;
  channels: string;
}

@Injectable()
export class ServiceMonitor {
  private healthStatus = new Map<string, IHealthStatus>();
  private alertConfigs = new Map<string, IAlertConfig[]>();
  private checkIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter,
    private readonly integrationConfig: ServiceIntegrationConfig,
  ) {
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadAlertConfigs();
      await this.setupHealthChecks();
      await this.setupMetricsCollection();
      this.logger.info('服务监控系统初始化完成');
    } catch (error) {
      this.logger.error('服务监控系统初始化失败', error);
      throw error;
    }
  }

  // 启动服务监控
  async startMonitoring(serviceId: string) {
    const timer = this.metrics.startTimer('start_monitoring');
    try {
      const service = this.integrationConfig.getServiceConfig(serviceId);
      if (!service) {
        throw new Error(`未找到服务配置: ${serviceId}`);
      }

      // 设置健康检查
      await this.setupServiceHealthCheck(service);

      // 设置指标收集
      await this.setupServiceMetrics(service);

      // 设置告警规则
      await this.setupServiceAlerts(service);

      this.metrics.increment('monitoring_started');
      timer.end();
    } catch (error) {
      this.metrics.increment('monitoring_start_error');
      timer.end();
      this.logger.error(`启动服务监控失败: ${error.message}`, error);
      throw error;
    }
  }

  // 健康检查
  private async setupServiceHealthCheck(service: IServiceConfig) {
    const interval = setInterval(async () => {
      try {
        const status = await this.checkServiceHealth(service);
        this.updateHealthStatus(service.id, status);

        if (status.status !== 'healthy') {
          await this.handleUnhealthyService(service.id, status);
        }

        this.metrics.gauge(`service_health_${service.id}`, status.status === 'healthy' ? 1 : 0);
      } catch (error) {
        this.logger.error(`健康检查失败: ${service.id}`, error);
      }
    }, service.health.interval);

    this.checkIntervals.set(service.id, interval);
  }

  // 检查服务健康状态
  private async checkServiceHealth(service: IServiceConfig): Promise<IHealthStatus> {
    const timer = this.metrics.startTimer('health_check');
    try {
      // 检查健康端点
      const response = await fetch(service.health.endpoint, {
        timeout: service.health.timeout,
      });

      // 收集性能指标
      const metrics = await this.collectServiceMetrics(service.id);

      const status: IHealthStatus = {
        serviceId: service.id,
        status: response.status === 200 ? 'healthy' : 'degraded',
        lastCheck: new Date(),
        metrics,
      };

      if (status.status !== 'healthy') {
        status.issues = [
          {
            type: 'health_check',
            message: `Health check failed with status ${response.status}`,
            timestamp: new Date(),
          },
        ];
      }

      this.metrics.increment('health_check_success');
      timer.end();
      return status;
    } catch (error) {
      this.metrics.increment('health_check_error');
      timer.end();

      return {
        serviceId: service.id,
        status: 'unhealthy',
        lastCheck: new Date(),
        metrics: {
          responseTime: 0,
          errorRate: 1,
          successRate: 0,
          throughput: 0,
        },
        issues: [
          {
            type: 'health_check_error',
            message: error.message,
            timestamp: new Date(),
          },
        ],
      };
    }
  }

  // 收集服务指标
  private async collectServiceMetrics(serviceId: string) {
    const timer = this.metrics.startTimer('collect_metrics');
    try {
      // 获取性能指标
      const responseTime = await this.metrics.getGauge(`${serviceId}_response_time`);
      const errorRate = await this.metrics.getGauge(`${serviceId}_error_rate`);
      const successRate = await this.metrics.getGauge(`${serviceId}_success_rate`);
      const throughput = await this.metrics.getGauge(`${serviceId}_throughput`);

      this.metrics.increment('metrics_collection_success');
      timer.end();

      return {
        responseTime,
        errorRate,
        successRate,
        throughput,
      };
    } catch (error) {
      this.metrics.increment('metrics_collection_error');
      timer.end();
      throw error;
    }
  }

  // 处理不健康的服务
  private async handleUnhealthyService(serviceId: string, status: IHealthStatus) {
    try {
      // 发送告警
      await this.sendServiceAlert(serviceId, status);

      // 尝试自动恢复
      await this.attemptServiceRecovery(serviceId);

      // 更新依赖服务状态
      await this.updateDependentServices(serviceId);

      // 记录事件
      this.eventEmitter.emit('service:unhealthy', {
        serviceId,
        status,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error(`处理不健康服务失败: ${serviceId}`, error);
    }
  }

  // 发送服务告警
  private async sendServiceAlert(serviceId: string, status: IHealthStatus) {
    const alerts = this.alertConfigs.get(serviceId) || [];

    for (const alert of alerts) {
      if (this.shouldTriggerAlert(status, alert)) {
        await this.triggerAlert(serviceId, status, alert);
      }
    }
  }

  // 判断是否需要触发告警
  private shouldTriggerAlert(status: IHealthStatus, alert: IAlertConfig): boolean {
    switch (alert.type) {
      case 'error_rate':
        return status.metrics.errorRate > alert.threshold;
      case 'response_time':
        return status.metrics.responseTime > alert.threshold;
      case 'throughput':
        return status.metrics.throughput < alert.threshold;
      case 'availability':
        return status.status === 'unhealthy';
      default:
        return false;
    }
  }

  // 触发告警
  private async triggerAlert(serviceId: string, status: IHealthStatus, alert: IAlertConfig) {
    const timer = this.metrics.startTimer('trigger_alert');
    try {
      // 构建告警消息
      const message = {
        serviceId,
        alert: {
          type: alert.type,
          severity: alert.severity,
          threshold: alert.threshold,
          current: this.getCurrentMetricValue(status, alert.type),
        },
        status,
        timestamp: new Date(),
      };

      // 发送到配置的通道
      for (const channel of alert.channels) {
        await this.sendAlertToChannel(channel, message);
      }

      this.metrics.increment('alert_triggered');
      timer.end();
    } catch (error) {
      this.metrics.increment('alert_trigger_error');
      timer.end();
      this.logger.error(`触发告警失败: ${serviceId}`, error);
    }
  }

  // 获取当前指标值
  private getCurrentMetricValue(status: IHealthStatus, type: string): number {
    switch (type) {
      case 'error_rate':
        return status.metrics.errorRate;
      case 'response_time':
        return status.metrics.responseTime;
      case 'throughput':
        return status.metrics.throughput;
      case 'availability':
        return status.status === 'healthy' ? 1 : 0;
      default:
        return 0;
    }
  }

  // 尝试服务恢复
  private async attemptServiceRecovery(serviceId: string) {
    const timer = this.metrics.startTimer('service_recovery');
    try {
      const service = this.integrationConfig.getServiceConfig(serviceId);
      if (!service) return;

      // 重试健康检查
      for (let i = 0; i < service.health.retries; i++) {
        const status = await this.checkServiceHealth(service);
        if (status.status === 'healthy') {
          this.updateHealthStatus(serviceId, status);
          this.metrics.increment('service_recovery_success');
          timer.end();
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.metrics.increment('service_recovery_failed');
      timer.end();
    } catch (error) {
      this.metrics.increment('service_recovery_error');
      timer.end();
      this.logger.error(`服务恢复失败: ${serviceId}`, error);
    }
  }

  // 更新依赖服务状态
  private async updateDependentServices(serviceId: string) {
    try {
      const dependencies = this.integrationConfig.getServiceDependencies(serviceId);

      for (const depId of dependencies) {
        const status = this.healthStatus.get(depId);
        if (status) {
          status.issues = status.issues || [];
          status.issues.push({
            type: 'dependency_unhealthy',
            message: `依赖服务 ${serviceId} 不健康`,
            timestamp: new Date(),
          });
          this.updateHealthStatus(depId, status);
        }
      }
    } catch (error) {
      this.logger.error(`更新依赖服务状态失败: ${serviceId}`, error);
    }
  }

  // 更新健康状态
  private updateHealthStatus(serviceId: string, status: IHealthStatus) {
    this.healthStatus.set(serviceId, status);
    this.eventEmitter.emit('health:updated', {
      serviceId,
      status,
      timestamp: new Date(),
    });
  }

  // 停止监控
  async stopMonitoring(serviceId: string) {
    const interval = this.checkIntervals.get(serviceId);
    if (interval) {
      clearInterval(interval);
      this.checkIntervals.delete(serviceId);
    }
    this.healthStatus.delete(serviceId);
    this.metrics.increment('monitoring_stopped');
  }

  // 获取服务状态
  getServiceStatus(serviceId: string): IHealthStatus | undefined {
    return this.healthStatus.get(serviceId);
  }

  // 获取所有服务状态
  getAllServiceStatuses(): Map<string, IHealthStatus> {
    return new Map(this.healthStatus);
  }
}
