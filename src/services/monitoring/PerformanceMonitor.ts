import { AlertManager } from './AlertManager';
import { CacheManager } from '../cache/CacheManager';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from './MetricsCollector';
import { injectable, inject } from 'inversify';

export interface IPerformanceMetric {
  /** type 的描述 */
  type: string;
  /** value 的描述 */
  value: number;
  /** tags 的描述 */
  tags: Recordstring /** string 的描述 */;
  /** string 的描述 */
  string;
  /** timestamp 的描述 */
  timestamp: number;
}

export interface IResourceUsage {
  /** cpu 的描述 */
  cpu: {
    usage: number;
    load: number;
  };
  /** memory 的描述 */
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
  };
  /** disk 的描述 */
  disk: {
    total: number;
    used: number;
    free: number;
  };
  /** network 的描述 */
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
}

export interface IServiceMetrics {
  /** responseTime 的描述 */
  responseTime: {
    avg: number;
    p95: number;
    p99: number;
  };
  /** throughput 的描述 */
  throughput: number;
  /** errorRate 的描述 */
  errorRate: number;
  /** concurrentRequests 的描述 */
  concurrentRequests: number;
}

@injectable()
export class PerformanceMonitor {
  private metrics: Map<string, IPerformanceMetric[]> = new Map();
  private readonly retentionPeriod = 7 * 24 * 60 * 60 * 1000; // 7天
  private readonly aggregationIntervals = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  };

  constructor(
    @inject() private logger: Logger,
    @inject() private metricsCollector: MetricsCollector,
    @inject() private alertManager: AlertManager,
    @inject() private cacheManager: CacheManager,
    @inject() private databaseService: DatabaseService,
    @inject() private eventBus: EventBus,
  ) {
    this.initialize();
  }

  /**
   * 初始化监控服务
   */
  private async initialize(): Promise<void> {
    try {
      // 加载历史数据
      await this.loadHistoricalData();

      // 设置定时任务
      this.setupScheduledTasks();

      // 订阅事件
      this.subscribeToEvents();

      this.logger.info('性能监控服务初始化成功');
    } catch (error) {
      this.logger.error('性能监控服务初始化失败', error);
      throw error;
    }
  }

  /**
   * 记录性能指标
   */
  public recordMetric(metric: IPerformanceMetric): void {
    try {
      const metrics = this.metrics.get(metric.type) || [];
      metrics.push(metric);
      this.metrics.set(metric.type, metrics);

      // 检查告警条件
      this.checkAlertConditions(metric);

      // 发布指标事件
      this.eventBus.publish('performance.metric.recorded', {
        type: metric.type,
        value: metric.value,
        timestamp: metric.timestamp,
      });
    } catch (error) {
      this.logger.error('记录性能指标失败', error);
    }
  }

  /**
   * 获取资源使用情况
   */
  public async getResourceUsage(): Promise<IResourceUsage> {
    try {
      const [cpu, memory, disk, network] = await Promise.all([
        this.getCPUUsage(),
        this.getMemoryUsage(),
        this.getDiskUsage(),
        this.getNetworkUsage(),
      ]);

      return {
        cpu,
        memory,
        disk,
        network,
      };
    } catch (error) {
      this.logger.error('获取资源使用情况失败', error);
      throw error;
    }
  }

  /**
   * 获取服务性能指标
   */
  public async getServiceMetrics(
    service: string,
    timeRange: { start: number; end: number },
  ): Promise<IServiceMetrics> {
    try {
      const metrics = await this.queryMetrics(`service.${service}`, timeRange);

      const responseTimeMetrics = metrics.filter(m => m.tags.metric === 'response_time');
      const errorMetrics = metrics.filter(m => m.tags.metric === 'error_count');
      const requestMetrics = metrics.filter(m => m.tags.metric === 'request_count');

      return {
        responseTime: this.calculateResponseTimeStats(responseTimeMetrics),
        throughput: this.calculateThroughput(requestMetrics),
        errorRate: this.calculateErrorRate(errorMetrics, requestMetrics),
        concurrentRequests: this.calculateConcurrentRequests(requestMetrics),
      };
    } catch (error) {
      this.logger.error('获取服务性能指标失败', error);
      throw error;
    }
  }

  /**
   * 查询性能指标
   */
  public async queryMetrics(
    type: string,
    timeRange: { start: number; end: number },
    aggregation?: keyof typeof this.aggregationIntervals,
  ): Promise<IPerformanceMetric[]> {
    try {
      const metrics = this.metrics.get(type) || [];
      let filteredMetrics = metrics.filter(
        m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end,
      );

      if (aggregation) {
        filteredMetrics = this.aggregateMetrics(
          filteredMetrics,
          this.aggregationIntervals[aggregation],
        );
      }

      return filteredMetrics;
    } catch (error) {
      this.logger.error('查询性能指标失败', error);
      throw error;
    }
  }

  /**
   * 聚合性能指标
   */
  private aggregateMetrics(metrics: IPerformanceMetric[], interval: number): IPerformanceMetric[] {
    const aggregated = new Map<number, IPerformanceMetric>();

    metrics.forEach(metric => {
      const timestamp = Math.floor(metric.timestamp / interval) * interval;
      const existing = aggregated.get(timestamp);

      if (existing) {
        existing.value = (existing.value + metric.value) / 2;
      } else {
        aggregated.set(timestamp, {
          ...metric,
          timestamp,
        });
      }
    });

    return Array.from(aggregated.values());
  }

  /**
   * 检查告警条件
   */
  private checkAlertConditions(metric: IPerformanceMetric): void {
    const alertRules = {
      'cpu.usage': { threshold: 80, duration: 300000 }, // 5分钟
      'memory.usage': { threshold: 85, duration: 300000 },
      'disk.usage': { threshold: 90, duration: 600000 }, // 10分钟
      'service.error_rate': { threshold: 5, duration: 300000 },
      'service.response_time': { threshold: 2000, duration: 300000 },
    };

    const rule = alertRules[metric.type];
    if (!rule) {
      return;
    }

    const recentMetrics = this.getRecentMetrics(metric.type, rule.duration);

    const average = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;

    if (average > rule.threshold) {
      this.alertManager.createAlert({
        type: 'performance',
        level: 'warning',
        title: `${metric.type} 超过阈值`,
        message: `${metric.type} 在过去 ${rule.duration / 1000} 秒内平均值为 ${average.toFixed(
          2,
        )}，超过阈值 ${rule.threshold}`,
        metadata: {
          metric: metric.type,
          value: average,
          threshold: rule.threshold,
          duration: rule.duration,
        },
      });
    }
  }

  /**
   * 获取最近的指标数据
   */
  private getRecentMetrics(type: string, duration: number): IPerformanceMetric[] {
    const now = Date.now();
    const metrics = this.metrics.get(type) || [];
    return metrics.filter(m => now - m.timestamp <= duration);
  }

  /**
   * 清理过期数据
   */
  private async cleanupExpiredData(): Promise<void> {
    try {
      const now = Date.now();
      for (const [type, metrics] of this.metrics.entries()) {
        const validMetrics = metrics.filter(m => now - m.timestamp <= this.retentionPeriod);
        this.metrics.set(type, validMetrics);
      }

      this.logger.info('清理过期性能指标数据完成');
    } catch (error) {
      this.logger.error('清理过期性能指标数据失败', error);
    }
  }

  /**
   * 持久化指标数据
   */
  private async persistMetrics(): Promise<void> {
    try {
      const metricsData = Object.fromEntries(this.metrics.entries());
      await this.databaseService.insert('performance_metrics', [
        {
          timestamp: Date.now(),
          data: metricsData,
        },
      ]);

      this.logger.info('持久化性能指标数据完成');
    } catch (error) {
      this.logger.error('持久化性能指标数据失败', error);
    }
  }

  /**
   * 加载历史数据
   */
  private async loadHistoricalData(): Promise<void> {
    try {
      const historicalMetrics = await this.databaseService.query('performance_metrics', {
        timestamp: {
          $gte: Date.now() - this.retentionPeriod,
        },
      });

      for (const record of historicalMetrics) {
        for (const [type, metrics] of Object.entries(record.data)) {
          this.metrics.set(type, metrics as IPerformanceMetric[]);
        }
      }

      this.logger.info('加载历史性能指标数据完成');
    } catch (error) {
      this.logger.error('加载历史性能指标数据失败', error);
    }
  }

  /**
   * 设置定时任务
   */
  private setupScheduledTasks(): void {
    // 每小时清理过期数据
    setInterval(() => {
      this.cleanupExpiredData();
    }, 60 * 60 * 1000);

    // 每5分钟持久化数据
    setInterval(() => {
      this.persistMetrics();
    }, 5 * 60 * 1000);

    // 每分钟收集系统资源使用情况
    setInterval(async () => {
      try {
        const usage = await this.getResourceUsage();
        this.recordSystemMetrics(usage);
      } catch (error) {
        this.logger.error('收集系统资源使用情况失败', error);
      }
    }, 60 * 1000);
  }

  /**
   * 订阅事件
   */
  private subscribeToEvents(): void {
    this.eventBus.subscribe('service.request.complete', (data: any) => {
      this.recordMetric({
        type: `service.${data.service}`,
        value: data.duration,
        tags: {
          metric: 'response_time',
          endpoint: data.endpoint,
          method: data.method,
          status: data.status.toString(),
        },
        timestamp: Date.now(),
      });
    });

    this.eventBus.subscribe('service.error', (data: any) => {
      this.recordMetric({
        type: `service.${data.service}`,
        value: 1,
        tags: {
          metric: 'error_count',
          error_type: data.error.type,
          error_message: data.error.message,
        },
        timestamp: Date.now(),
      });
    });
  }

  /**
   * 记录系统指标
   */
  private recordSystemMetrics(usage: IResourceUsage): void {
    // CPU使用率
    this.recordMetric({
      type: 'cpu.usage',
      value: usage.cpu.usage,
      tags: {
        metric: 'cpu_usage',
      },
      timestamp: Date.now(),
    });

    // 内存使用率
    this.recordMetric({
      type: 'memory.usage',
      value: (usage.memory.used / usage.memory.total) * 100,
      tags: {
        metric: 'memory_usage',
      },
      timestamp: Date.now(),
    });

    // 磁盘使用率
    this.recordMetric({
      type: 'disk.usage',
      value: (usage.disk.used / usage.disk.total) * 100,
      tags: {
        metric: 'disk_usage',
      },
      timestamp: Date.now(),
    });

    // 网络流量
    this.recordMetric({
      type: 'network.traffic',
      value: usage.network.bytesIn + usage.network.bytesOut,
      tags: {
        metric: 'network_traffic',
        direction: 'total',
      },
      timestamp: Date.now(),
    });
  }

  /**
   * 获取CPU使用情况
   */
  private async getCPUUsage(): Promise<IResourceUsage['cpu']> {
    // 实现CPU使用情况获取逻辑
    return {
      usage: 0,
      load: [0, 0, 0],
    };
  }

  /**
   * 获取内存使用情况
   */
  private async getMemoryUsage(): Promise<IResourceUsage['memory']> {
    // 实现内存使用情况获取逻辑
    return {
      total: 0,
      used: 0,
      free: 0,
      cached: 0,
    };
  }

  /**
   * 获取磁盘使用情况
   */
  private async getDiskUsage(): Promise<IResourceUsage['disk']> {
    // 实现磁盘使用情况获取逻辑
    return {
      total: 0,
      used: 0,
      free: 0,
    };
  }

  /**
   * 获取网络使用情况
   */
  private async getNetworkUsage(): Promise<IResourceUsage['network']> {
    // 实现网络使用情况获取逻辑
    return {
      bytesIn: 0,
      bytesOut: 0,
      packetsIn: 0,
      packetsOut: 0,
    };
  }

  /**
   * 计算响应时间统计
   */
  private calculateResponseTimeStats(
    metrics: IPerformanceMetric[],
  ): IServiceMetrics['responseTime'] {
    if (metrics.length === 0) {
      return { avg: 0, p95: 0, p99: 0 };
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const p95 = values[Math.floor(values.length * 0.95)];
    const p99 = values[Math.floor(values.length * 0.99)];

    return { avg, p95, p99 };
  }

  /**
   * 计算吞吐量
   */
  private calculateThroughput(metrics: IPerformanceMetric[]): number {
    if (metrics.length < 2) {
      return 0;
    }

    const timeRange = metrics[metrics.length - 1].timestamp - metrics[0].timestamp;
    return (metrics.length / timeRange) * 1000; // 转换为每秒请求数
  }

  /**
   * 计算错误率
   */
  private calculateErrorRate(
    errorMetrics: IPerformanceMetric[],
    requestMetrics: IPerformanceMetric[],
  ): number {
    const totalErrors = errorMetrics.reduce((sum, m) => sum + m.value, 0);
    const totalRequests = requestMetrics.reduce((sum, m) => sum + m.value, 0);

    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  }

  /**
   * 计算并发请求数
   */
  private calculateConcurrentRequests(metrics: IPerformanceMetric[]): number {
    if (metrics.length === 0) {
      return 0;
    }

    // 使用最近1分钟的数据计算并发数
    const recentMetrics = metrics.filter(m => Date.now() - m.timestamp <= 60 * 1000);

    return recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
  }
}
