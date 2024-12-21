import { AlertManager } from './AlertManager';
import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsCollector } from './MetricsCollector';

@Injectable()
export class MonitoringService {
  private readonly metricsInterval: number = 60000; // 1分钟
  private readonly metricsCollectors: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly metricsCollector: MetricsCollector,
    private readonly alertManager: AlertManager,
  ) {}

  async startMonitoring(service: {
    id: string;
    name: string;
    host: string;
    port: number;
    type: string;
  }): Promise<void> {
    try {
      // 创建监��配置
      const config = await this.createMonitoringConfig(service);

      // 启动指标收集
      this.startMetricsCollection(service, config);

      // 发送监控启动事件
      await this.eventBus.emit('monitoring.started', {
        service,
        config,
      });
    } catch (error) {
      this.logger.error('启动监控失败', error);
      throw error;
    }
  }

  private async createMonitoringConfig(service: any): Promise<any> {
    // 根据服务类型设置默认配置
    const defaultConfig = this.getDefaultConfig(service.type);

    // 创建监控配置
    const config = await this.databaseService.create('monitoring_configs', {
      serviceId: service.id,
      metrics: defaultConfig.metrics,
      thresholds: defaultConfig.thresholds,
      alerts: defaultConfig.alerts,
      retention: defaultConfig.retention,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return config;
  }

  private getDefaultConfig(serviceType: string): any {
    switch (serviceType) {
      case 'web':
        return {
          metrics: ['cpu', 'memory', 'requests', 'latency', 'errors'],
          thresholds: {
            cpu: 80,
            memory: 85,
            latency: 1000,
            errorRate: 0.01,
          },
          alerts: [
            {
              metric: 'cpu',
              condition: 'gt',
              threshold: 80,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'memory',
              condition: 'gt',
              threshold: 85,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'latency',
              condition: 'gt',
              threshold: 1000,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'errorRate',
              condition: 'gt',
              threshold: 0.01,
              duration: '5m',
              severity: 'critical',
            },
          ],
          retention: {
            raw: '7d',
            aggregated: '30d',
          },
        };
      case 'database':
        return {
          metrics: ['cpu', 'memory', 'connections', 'queries', 'latency'],
          thresholds: {
            cpu: 70,
            memory: 80,
            connections: 1000,
            latency: 100,
          },
          alerts: [
            {
              metric: 'cpu',
              condition: 'gt',
              threshold: 70,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'memory',
              condition: 'gt',
              threshold: 80,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'connections',
              condition: 'gt',
              threshold: 1000,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'latency',
              condition: 'gt',
              threshold: 100,
              duration: '5m',
              severity: 'critical',
            },
          ],
          retention: {
            raw: '7d',
            aggregated: '30d',
          },
        };
      default:
        return {
          metrics: ['cpu', 'memory'],
          thresholds: {
            cpu: 80,
            memory: 85,
          },
          alerts: [
            {
              metric: 'cpu',
              condition: 'gt',
              threshold: 80,
              duration: '5m',
              severity: 'warning',
            },
            {
              metric: 'memory',
              condition: 'gt',
              threshold: 85,
              duration: '5m',
              severity: 'warning',
            },
          ],
          retention: {
            raw: '7d',
            aggregated: '30d',
          },
        };
    }
  }

  private startMetricsCollection(service: any, config: any): void {
    // 清除已存在的收集器
    if (this.metricsCollectors.has(service.id)) {
      clearInterval(this.metricsCollectors.get(service.id));
    }

    // 启动新的收集器
    const interval = setInterval(async () => {
      try {
        await this.collectMetrics(service, config);
      } catch (error) {
        this.logger.error(`收集指标失败: ${service.name}`, error);
      }
    }, this.metricsInterval);

    this.metricsCollectors.set(service.id, interval);
  }

  private async collectMetrics(service: any, config: any): Promise<void> {
    try {
      // 收集指标
      const metrics = await this.metricsCollector.collect({
        host: service.host,
        port: service.port,
        metrics: config.metrics,
      });

      // 保存指标
      await this.saveMetrics(service.id, metrics);

      // 检查阈值
      await this.checkThresholds(service, config, metrics);
    } catch (error) {
      this.logger.error('收集指标失败', error);
      throw error;
    }
  }

  private async saveMetrics(serviceId: string, metrics: any): Promise<void> {
    await this.databaseService.create('service_metrics', {
      serviceId,
      metrics,
      timestamp: new Date(),
    });
  }

  private async checkThresholds(service: any, config: any, metrics: any): Promise<void> {
    for (const alert of config.alerts) {
      const value = metrics[alert.metric];
      if (!value) continue;

      const threshold = alert.threshold;
      const condition = alert.condition;
      const duration = this.parseDuration(alert.duration);

      // 检查是否超过阈值
      if (this.checkThresholdViolation(value, threshold, condition)) {
        // 检查持续时间
        const violations = await this.getRecentViolations(
          service.id,
          alert.metric,
          threshold,
          condition,
          duration,
        );

        if (violations.length >= duration / this.metricsInterval) {
          // 触发告警
          await this.alertManager.createAlert({
            serviceId: service.id,
            serviceName: service.name,
            metric: alert.metric,
            value,
            threshold,
            condition,
            severity: alert.severity,
            timestamp: new Date(),
          });
        }
      }
    }
  }

  private checkThresholdViolation(value: number, threshold: number, condition: string): boolean {
    switch (condition) {
      case 'gt':
        return value > threshold;
      case 'lt':
        return value < threshold;
      case 'gte':
        return value >= threshold;
      case 'lte':
        return value <= threshold;
      case 'eq':
        return value === threshold;
      default:
        return false;
    }
  }

  private async getRecentViolations(
    serviceId: string,
    metric: string,
    threshold: number,
    condition: string,
    duration: number,
  ): Promise<any[]> {
    const startTime = new Date(Date.now() - duration);

    return await this.databaseService.find('service_metrics', {
      serviceId,
      timestamp: { $gte: startTime },
      [`metrics.${metric}`]: this.getThresholdQuery(threshold, condition),
    });
  }

  private getThresholdQuery(threshold: number, condition: string): any {
    switch (condition) {
      case 'gt':
        return { $gt: threshold };
      case 'lt':
        return { $lt: threshold };
      case 'gte':
        return { $gte: threshold };
      case 'lte':
        return { $lte: threshold };
      case 'eq':
        return threshold;
      default:
        return {};
    }
  }

  private parseDuration(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1));

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value;
    }
  }

  async stopMonitoring(serviceId: string): Promise<void> {
    try {
      // 停止指标收集
      if (this.metricsCollectors.has(serviceId)) {
        clearInterval(this.metricsCollectors.get(serviceId));
        this.metricsCollectors.delete(serviceId);
      }

      // 更新监控状态
      await this.databaseService.update(
        'monitoring_configs',
        { serviceId },
        {
          status: 'stopped',
          updatedAt: new Date(),
        },
      );

      // 发送监控停止事件
      await this.eventBus.emit('monitoring.stopped', { serviceId });
    } catch (error) {
      this.logger.error('停止监控失败', error);
      throw error;
    }
  }

  async updateMonitoringConfig(serviceId: string, config: any): Promise<void> {
    try {
      // 更新配置
      await this.databaseService.update(
        'monitoring_configs',
        { serviceId },
        {
          ...config,
          updatedAt: new Date(),
        },
      );

      // 重启监控
      const service = await this.databaseService.findOne('services', { _id: serviceId });
      if (service) {
        this.startMetricsCollection(service, config);
      }

      // 发送配置更新事件
      await this.eventBus.emit('monitoring.config_updated', {
        serviceId,
        config,
      });
    } catch (error) {
      this.logger.error('更新监控配置失败', error);
      throw error;
    }
  }

  async getServiceMetrics(
    serviceId: string,
    options: {
      metrics?: string[];
      startTime?: Date;
      endTime?: Date;
      interval?: string;
    },
  ): Promise<any> {
    try {
      const query: any = { serviceId };

      if (options.startTime || options.endTime) {
        query.timestamp = {};
        if (options.startTime) query.timestamp.$gte = options.startTime;
        if (options.endTime) query.timestamp.$lte = options.endTime;
      }

      const metrics = await this.databaseService.find('service_metrics', query, {
        sort: { timestamp: 1 },
      });

      // 按时间间隔聚合
      if (options.interval) {
        return this.aggregateMetrics(metrics, options.interval, options.metrics);
      }

      return metrics;
    } catch (error) {
      this.logger.error('获取服务指标失败', error);
      throw error;
    }
  }

  private aggregateMetrics(metrics: any[], interval: string, selectedMetrics?: string[]): any {
    const intervalMs = this.parseDuration(interval);
    const aggregated: any = {};

    metrics.forEach(metric => {
      const timestamp = Math.floor(metric.timestamp.getTime() / intervalMs) * intervalMs;

      if (!aggregated[timestamp]) {
        aggregated[timestamp] = {
          timestamp: new Date(timestamp),
          metrics: {},
        };
      }

      Object.entries(metric.metrics).forEach(([key, value]) => {
        if (!selectedMetrics || selectedMetrics.includes(key)) {
          if (!aggregated[timestamp].metrics[key]) {
            aggregated[timestamp].metrics[key] = [];
          }
          aggregated[timestamp].metrics[key].push(value);
        }
      });
    });

    // 计算聚合值
    Object.values(aggregated).forEach((group: any) => {
      Object.entries(group.metrics).forEach(([key, values]) => {
        group.metrics[key] = {
          avg: this.average(values as number[]),
          min: Math.min(...(values as number[])),
          max: Math.max(...(values as number[])),
          count: values.length,
        };
      });
    });

    return Object.values(aggregated);
  }

  private average(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  async getServiceAlerts(
    serviceId: string,
    options: {
      severity?: string;
      startTime?: Date;
      endTime?: Date;
      status?: string;
    },
  ): Promise<any[]> {
    try {
      const query: any = { serviceId };

      if (options.severity) {
        query.severity = options.severity;
      }

      if (options.status) {
        query.status = options.status;
      }

      if (options.startTime || options.endTime) {
        query.timestamp = {};
        if (options.startTime) query.timestamp.$gte = options.startTime;
        if (options.endTime) query.timestamp.$lte = options.endTime;
      }

      return await this.databaseService.find('service_alerts', query, {
        sort: { timestamp: -1 },
      });
    } catch (error) {
      this.logger.error('获取服务告警失败', error);
      throw error;
    }
  }
}
