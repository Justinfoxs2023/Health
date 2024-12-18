import { Gauge, Counter, Histogram } from 'prom-client';
import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';

export class MetricsService {
  private static instance: MetricsService;
  private logger: Logger;
  private redis: Redis;

  // API性能指标
  private apiResponseTime: Histogram;
  private apiRequestCount: Counter;
  private apiErrorCount: Counter;

  // 系统资源指标
  private cpuUsage: Gauge;
  private memoryUsage: Gauge;
  private diskUsage: Gauge;

  // 业务指标
  private activeUsers: Gauge;
  private healthDataPoints: Counter;
  private aiProcessingTime: Histogram;

  private constructor() {
    this.logger = new Logger('MetricsService');
    this.redis = new Redis();

    // 初始化指标
    this.initializeMetrics();
  }

  static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  private initializeMetrics() {
    // API指标
    this.apiResponseTime = new Histogram({
      name: 'api_response_time',
      help: 'API响应时间分布',
      labelNames: ['method', 'endpoint', 'status'],
    });

    this.apiRequestCount = new Counter({
      name: 'api_request_count',
      help: 'API请求总数',
      labelNames: ['method', 'endpoint'],
    });

    this.apiErrorCount = new Counter({
      name: 'api_error_count',
      help: 'API错误总数',
      labelNames: ['method', 'endpoint', 'error_type'],
    });

    // 系统资源指标
    this.cpuUsage = new Gauge({
      name: 'system_cpu_usage',
      help: 'CPU使用率',
    });

    this.memoryUsage = new Gauge({
      name: 'system_memory_usage',
      help: '内存使用率',
    });

    this.diskUsage = new Gauge({
      name: 'system_disk_usage',
      help: '磁盘使用率',
    });

    // 业务指标
    this.activeUsers = new Gauge({
      name: 'active_users',
      help: '活跃用户数',
      labelNames: ['type'],
    });

    this.healthDataPoints = new Counter({
      name: 'health_data_points',
      help: '健康数据点数',
      labelNames: ['type'],
    });

    this.aiProcessingTime = new Histogram({
      name: 'ai_processing_time',
      help: 'AI处理时间分布',
      labelNames: ['model', 'operation'],
    });
  }

  // 记录API请求
  async recordApiRequest(method: string, endpoint: string, duration: number, status: number) {
    this.apiResponseTime.labels(method, endpoint, status.toString()).observe(duration);
    this.apiRequestCount.labels(method, endpoint).inc();

    if (status >= 400) {
      this.apiErrorCount.labels(method, endpoint, 'http_error').inc();
    }
  }

  // 更新系统资源使用情况
  async updateSystemMetrics(metrics: { cpu: number; memory: number; disk: number }) {
    this.cpuUsage.set(metrics.cpu);
    this.memoryUsage.set(metrics.memory);
    this.diskUsage.set(metrics.disk);

    // 缓存系统指标
    await this.redis.setex('system:metrics', 60, JSON.stringify(metrics));
  }

  // 记录业务指标
  async recordBusinessMetrics(type: string, value: number) {
    switch (type) {
      case 'active_users':
        this.activeUsers.labels(type).set(value);
        break;
      case 'health_data':
        this.healthDataPoints.labels(type).inc(value);
        break;
    }
  }

  // 记录AI处理时间
  async recordAiProcessing(model: string, operation: string, duration: number) {
    this.aiProcessingTime.labels(model, operation).observe(duration);
  }

  // 获取所有指标
  async getMetrics() {
    return {
      api: {
        responseTime: this.apiResponseTime.get(),
        requestCount: this.apiRequestCount.get(),
        errorCount: this.apiErrorCount.get(),
      },
      system: {
        cpu: this.cpuUsage.get(),
        memory: this.memoryUsage.get(),
        disk: this.diskUsage.get(),
      },
      business: {
        activeUsers: this.activeUsers.get(),
        healthDataPoints: this.healthDataPoints.get(),
        aiProcessingTime: this.aiProcessingTime.get(),
      },
    };
  }
}
