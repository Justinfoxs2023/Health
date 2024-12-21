import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';
import { Metrics } from '../schemas/Metrics';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { createClient } from 'redis';
import { logger } from './logger';
import { performance } from 'perf_hooks';

// 初始化Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new ProfilingIntegration(),
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', process.env.DOMAIN],
    }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

// Redis客户端
const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', err => logger.error('Redis错误:', err));

// 性能指标收集
interface IPerformanceMetrics {
  /** requestCount 的描述 */
  requestCount: number;
  /** responseTime 的描述 */
  responseTime: number;
  /** errorCount 的描述 */
  errorCount: number;
  /** memoryUsage 的描述 */
  memoryUsage: number;
  /** cpuUsage 的描述 */
  cpuUsage: number;
}

class MonitoringService {
  private metrics: IPerformanceMetrics = {
    requestCount: 0,
    responseTime: 0,
    errorCount: 0,
    memoryUsage: 0,
    cpuUsage: 0,
  };

  // 记录请求
  async recordRequest(path: string, duration: number) {
    try {
      this.metrics.requestCount++;
      this.metrics.responseTime += duration;

      // 存储到Redis用于实时监控
      await redis.hIncrBy('monitoring:requests', path, 1);
      await redis.hIncrBy('monitoring:duration', path, duration);

      // 存储到MongoDB用于长期分析
      await Metrics.create({
        type: 'request',
        path,
        duration,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('记录请求指标失败:', error);
      Sentry.captureException(error);
    }
  }

  // 记录错误
  async recordError(error: Error, path: string) {
    try {
      this.metrics.errorCount++;

      // 发送到Sentry
      Sentry.captureException(error);

      // 存储到Redis用于实时监控
      await redis.hIncrBy('monitoring:errors', path, 1);

      // 存储到MongoDB用于长期分析
      await Metrics.create({
        type: 'error',
        path,
        error: error.message,
        stack: error.stack,
        timestamp: new Date(),
      });
    } catch (err) {
      logger.error('记录错误指标失败:', err);
    }
  }

  // 记录系统资源使用
  async recordResourceUsage() {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      this.metrics.memoryUsage = memoryUsage.heapUsed;
      this.metrics.cpuUsage = cpuUsage.user + cpuUsage.system;

      // 存储到Redis用于实时监控
      await redis.hSet('monitoring:resources', {
        memory: memoryUsage.heapUsed,
        cpu: cpuUsage.user + cpuUsage.system,
      });

      // 存储到MongoDB用于长期分析
      await Metrics.create({
        type: 'resource',
        memory: memoryUsage.heapUsed,
        cpu: cpuUsage.user + cpuUsage.system,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('记录资源使用指标失败:', error);
      Sentry.captureException(error);
    }
  }

  // 性能追踪中间件
  performanceMiddleware = async (req: any, res: any, next: any) => {
    const start = performance.now();
    const path = req.path;

    // 添加请求追踪
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: `${req.method} ${path}`,
    });

    // 将transaction附加到请求对象
    req.transaction = transaction;

    res.once('finish', async () => {
      const duration = performance.now() - start;
      await this.recordRequest(path, duration);

      // 结束transaction
      transaction.setHttpStatus(res.statusCode);
      transaction.finish();
    });

    next();
  };

  // 获取实时监控数据
  async getRealTimeMetrics() {
    try {
      const [requests, errors, resources] = await Promise.all([
        redis.hGetAll('monitoring:requests'),
        redis.hGetAll('monitoring:errors'),
        redis.hGetAll('monitoring:resources'),
      ]);

      return {
        requests,
        errors,
        resources,
        currentMetrics: this.metrics,
      };
    } catch (error) {
      logger.error('获取实时监控数据失败:', error);
      throw error;
    }
  }

  // 获取历史监控数据
  async getHistoricalMetrics(startDate: Date, endDate: Date) {
    try {
      return await Metrics.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ timestamp: -1 });
    } catch (error) {
      logger.error('获取历史监控数据失败:', error);
      throw error;
    }
  }

  // 设置告警阈值
  async setAlertThreshold(metric: string, threshold: number) {
    try {
      await redis.hSet('monitoring:thresholds', metric, threshold);
    } catch (error) {
      logger.error('设置告警阈值失败:', error);
      throw error;
    }
  }

  // 检查告警
  async checkAlerts() {
    try {
      const thresholds = await redis.hGetAll('monitoring:thresholds');
      const currentMetrics = await this.getRealTimeMetrics();

      for (const [metric, threshold] of Object.entries(thresholds)) {
        const value = currentMetrics.currentMetrics[metric as keyof IPerformanceMetrics];
        if (value > Number(threshold)) {
          logger.warn(`告警: ${metric} (${value}) 超过阈值 ${threshold}`);
          // 发送告警通知
          await this.sendAlert(metric, value, Number(threshold));
        }
      }
    } catch (error) {
      logger.error('检查告警失败:', error);
      throw error;
    }
  }

  // 发送告警
  private async sendAlert(metric: string, value: number, threshold: number) {
    try {
      // 记录告警
      await Metrics.create({
        type: 'alert',
        metric,
        value,
        threshold,
        timestamp: new Date(),
      });

      // TODO: 实现告警通知（邮件、短信等）
    } catch (error) {
      logger.error('发送告警失败:', error);
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService();
