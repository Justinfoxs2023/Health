import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { logger } from '../logger';
import { performanceConfig } from '../../config/performance.config';

interface IPerformanceMetrics {
  /** responseTime 的描述 */
  responseTime: number;
  /** memoryUsage 的描述 */
  memoryUsage: number;
  /** cpuUsage 的描述 */
  cpuUsage: number;
  /** activeConnections 的描述 */
  activeConnections: number;
  /** errorRate 的描述 */
  errorRate: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private metrics: IPerformanceMetrics = {
    responseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    activeConnections: 0,
    errorRate: 0,
  };

  private constructor() {
    this.initSentry();
    this.startMetricsCollection();
  }

  /**
   * 获取监控服务实例
   */
  static getInstance() {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * 初始化Sentry
   */
  private initSentry() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      integrations: [
        new ProfilingIntegration(),
        new Integrations.Http({ tracing: true }),
        new Integrations.Express(),
        new Integrations.Mongo(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
  }

  /**
   * 开始收集性能指标
   */
  private startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
    }, 5000); // 每5秒收集一次
  }

  /**
   * 收集性能指标
   */
  private async collectMetrics() {
    try {
      const [cpuUsage, memoryUsage] = await Promise.all([
        this.getCPUUsage(),
        this.getMemoryUsage(),
      ]);

      this.metrics = {
        ...this.metrics,
        cpuUsage,
        memoryUsage,
      };

      // 检查是否超过阈值
      this.checkThresholds();

      // 记录到Sentry
      Sentry.setContext('performance', this.metrics);
    } catch (error) {
      logger.error('性能指标收集失败:', error);
    }
  }

  /**
   * 获取CPU使用率
   */
  private async getCPUUsage(): Promise<number> {
    const startUsage = process.cpuUsage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endUsage = process.cpuUsage(startUsage);
    return (endUsage.user + endUsage.system) / 1000000; // 转换为秒
  }

  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number {
    const used = process.memoryUsage();
    return used.heapUsed / 1024 / 1024; // 转换为MB
  }

  /**
   * 检查性能指标是否超过阈值
   */
  private checkThresholds() {
    const { thresholds } = performanceConfig;

    if (this.metrics.responseTime > thresholds.responseTime) {
      this.reportIssue('响应时间过高', {
        current: this.metrics.responseTime,
        threshold: thresholds.responseTime,
      });
    }

    if (this.metrics.memoryUsage > thresholds.memoryUsage) {
      this.reportIssue('内存使用过高', {
        current: this.metrics.memoryUsage,
        threshold: thresholds.memoryUsage,
      });
    }

    if (this.metrics.errorRate > 0.01) {
      // 1%错误率阈值
      this.reportIssue('错误率过高', {
        current: this.metrics.errorRate,
        threshold: 0.01,
      });
    }
  }

  /**
   * 向Sentry报告问题
   */
  private reportIssue(title: string, data: any) {
    Sentry.captureMessage(title, {
      level: 'warning',
      extra: {
        ...data,
        metrics: this.metrics,
      },
    });
  }

  /**
   * 记录请求性能
   */
  recordRequestPerformance(startTime: number, endTime: number) {
    const responseTime = endTime - startTime;
    this.metrics.responseTime = responseTime;

    // 记录到Sentry性能监控
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: 'HTTP Request',
    });

    transaction.setMeasurement('response_time_ms', responseTime);
    transaction.finish();
  }

  /**
   * 记录错误
   */
  recordError(error: Error, context?: any) {
    Sentry.captureException(error, {
      extra: {
        ...context,
        metrics: this.metrics,
      },
    });

    // 更新错误率
    this.metrics.errorRate = (this.metrics.errorRate * 9 + 1) / 10; // 使用移动平均
  }

  /**
   * 获取当前性能指标
   */
  getMetrics(): IPerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 重置性能指标
   */
  resetMetrics() {
    this.metrics = {
      responseTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      activeConnections: 0,
      errorRate: 0,
    };
  }
}

export const monitoringService = MonitoringService.getInstance();
