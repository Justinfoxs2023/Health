import * as prometheus from 'prom-client';
import { Injectable } from '@nestjs/common';
import { Logger } from '../utils/logger';

@Injectable()
export class PerformanceMonitor {
  private readonly logger = new Logger(PerformanceMonitor.name);

  // 模型训练时间
  private readonly trainingDuration = new prometheus.Histogram({
    name: 'model_training_duration_seconds',
    help: '模型训练耗时(秒)',
    labelNames: ['model_type'],
    buckets: [10, 30, 60, 120, 300, 600, 1800, 3600],
  });

  // 模型评估指标
  private readonly modelMetrics = new prometheus.Gauge({
    name: 'model_evaluation_metrics',
    help: '模型评估指标',
    labelNames: ['model_type', 'metric_name'],
  });

  // 数据处理时间
  private readonly dataProcessingDuration = new prometheus.Histogram({
    name: 'data_processing_duration_seconds',
    help: '数据处理耗时(秒)',
    labelNames: ['operation_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  });

  // 数据验证错误计数
  private readonly validationErrors = new prometheus.Counter({
    name: 'data_validation_errors_total',
    help: '数据验证错误总数',
    labelNames: ['error_type'],
  });

  // 内存使用情况
  private readonly memoryUsage = new prometheus.Gauge({
    name: 'memory_usage_bytes',
    help: '内存使用情况(字节)',
    labelNames: ['memory_type'],
  });

  // CPU使用情况
  private readonly cpuUsage = new prometheus.Gauge({
    name: 'cpu_usage_percent',
    help: 'CPU使用率(%)',
    labelNames: ['cpu_type'],
  });

  // 模型预测延迟
  private readonly predictionLatency = new prometheus.Histogram({
    name: 'model_prediction_latency_seconds',
    help: '模型预测延迟(秒)',
    labelNames: ['model_type'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  });

  // 缓存命中率
  private readonly cacheHitRate = new prometheus.Gauge({
    name: 'cache_hit_rate_percent',
    help: '缓存命中率(%)',
    labelNames: ['cache_type'],
  });

  constructor() {
    // 启动系统资源监控
    this.startResourceMonitoring();
  }

  /**
   * 记录模型训练时间
   */
  recordTrainingDuration(modelType: string, duration: number): void {
    try {
      this.trainingDuration.labels(modelType).observe(duration);
      this.logger.debug('记录模型训练时间', { modelType, duration });
    } catch (error) {
      this.logger.error('记录模型训练时间失败', error);
    }
  }

  /**
   * 记录模型评估指��
   */
  recordModelMetrics(
    modelType: string,
    metrics: {
      loss: number;
      accuracy: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
    },
  ): void {
    try {
      Object.entries(metrics).forEach(([metricName, value]) => {
        this.modelMetrics.labels(modelType, metricName).set(value);
      });
      this.logger.debug('记录模型评估指标', { modelType, metrics });
    } catch (error) {
      this.logger.error('记录模型评估指标失败', error);
    }
  }

  /**
   * 记录数据处理时间
   */
  recordDataProcessingDuration(operationType: string, duration: number): void {
    try {
      this.dataProcessingDuration.labels(operationType).observe(duration);
      this.logger.debug('记录数据处理时间', { operationType, duration });
    } catch (error) {
      this.logger.error('记录数据处理时间失败', error);
    }
  }

  /**
   * 记录数据验证错误
   */
  recordValidationError(errorType: string): void {
    try {
      this.validationErrors.labels(errorType).inc();
      this.logger.debug('记录数据验证错误', { errorType });
    } catch (error) {
      this.logger.error('记录数据验证错误失败', error);
    }
  }

  /**
   * 记录模型预测延迟
   */
  recordPredictionLatency(modelType: string, duration: number): void {
    try {
      this.predictionLatency.labels(modelType).observe(duration);
      this.logger.debug('记录模型预测延迟', { modelType, duration });
    } catch (error) {
      this.logger.error('记录模型预测延迟失败', error);
    }
  }

  /**
   * 记录缓存命中率
   */
  recordCacheHitRate(cacheType: string, hitRate: number): void {
    try {
      this.cacheHitRate.labels(cacheType).set(hitRate);
      this.logger.debug('记录缓存命中率', { cacheType, hitRate });
    } catch (error) {
      this.logger.error('记录缓存命中率失败', error);
    }
  }

  /**
   * 获取所有指标
   */
  async getMetrics(): Promise<string> {
    try {
      return await prometheus.register.metrics();
    } catch (error) {
      this.logger.error('获取指标失败', error);
      throw error;
    }
  }

  /**
   * 启动系统资源监控
   */
  private startResourceMonitoring(): void {
    // 每分钟更新一次系统资源使用情况
    setInterval(() => {
      try {
        const memUsage = process.memoryUsage();

        // 记录内存使用情况
        this.memoryUsage.labels('heap_used').set(memUsage.heapUsed);
        this.memoryUsage.labels('heap_total').set(memUsage.heapTotal);
        this.memoryUsage.labels('rss').set(memUsage.rss);
        this.memoryUsage.labels('external').set(memUsage.external);

        // 记录CPU使用情况
        const startUsage = process.cpuUsage();
        setTimeout(() => {
          const endUsage = process.cpuUsage(startUsage);
          const userCPUUsage = endUsage.user / 1000000; // 转换为秒
          const systemCPUUsage = endUsage.system / 1000000;

          this.cpuUsage.labels('user').set(userCPUUsage);
          this.cpuUsage.labels('system').set(systemCPUUsage);
        }, 100);

        this.logger.debug('更新系统资源使用情况');
      } catch (error) {
        this.logger.error('更新系统资源使用情况失败', error);
      }
    }, 60000);
  }

  /**
   * 创建性能监控装饰器
   */
  static Monitor(options: {
    type: 'training' | 'prediction' | 'data_processing';
    modelType?: string;
    operationType?: string;
  }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      const monitor = new PerformanceMonitor();

      descriptor.value = async function (...args: any[]) {
        const startTime = Date.now();

        try {
          const result = await originalMethod.apply(this, args);
          const duration = (Date.now() - startTime) / 1000;

          switch (options.type) {
            case 'training':
              monitor.recordTrainingDuration(options.modelType, duration);
              break;
            case 'prediction':
              monitor.recordPredictionLatency(options.modelType, duration);
              break;
            case 'data_processing':
              monitor.recordDataProcessingDuration(options.operationType, duration);
              break;
          }

          return result;
        } catch (error) {
          if (options.type === 'data_processing') {
            monitor.recordValidationError(error.code || 'UNKNOWN_ERROR');
          }
          throw error;
        }
      };

      return descriptor;
    };
  }
}
