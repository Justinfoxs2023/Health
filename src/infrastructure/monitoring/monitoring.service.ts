import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';
import { Counter, Gauge, Histogram, Registry } from 'prom-client';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private readonly registry: Registry;
  private readonly logger = new Logger(MonitoringService.name);

  // 请求计数器
  private readonly requestCounter: Counter;
  // 错误计数器
  private readonly errorCounter: Counter;
  // 响应时间直方图
  private readonly responseTimeHistogram: Histogram;
  // 活跃连接数
  private readonly activeConnections: Gauge;
  // 系统资源指标
  private readonly cpuUsage: Gauge;
  private readonly memoryUsage: Gauge;
  private readonly gcDuration: Histogram;

  constructor(private readonly config: ConfigService) {
    this.registry = new Registry();
    this.initializeMetrics();
  }

  async onModuleInit() {
    this.startCollectingMetrics();
  }

  private initializeMetrics() {
    // 初始化所有指标
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status']
    });

    this.errorCounter = new Counter({
      name: 'error_total',
      help: 'Total number of errors',
      labelNames: ['type', 'service']
    });

    this.responseTimeHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path']
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections'
    });

    this.cpuUsage = new Gauge({
      name: 'process_cpu_usage',
      help: 'Process CPU usage percentage'
    });

    this.memoryUsage = new Gauge({
      name: 'process_memory_usage_bytes',
      help: 'Process memory usage in bytes'
    });

    this.gcDuration = new Histogram({
      name: 'gc_duration_seconds',
      help: 'Garbage collection duration'
    });

    // 注册所有指标
    this.registry.registerMetric(this.requestCounter);
    this.registry.registerMetric(this.errorCounter);
    this.registry.registerMetric(this.responseTimeHistogram);
    this.registry.registerMetric(this.activeConnections);
    this.registry.registerMetric(this.cpuUsage);
    this.registry.registerMetric(this.memoryUsage);
    this.registry.registerMetric(this.gcDuration);
  }

  private startCollectingMetrics() {
    // 定期收集系统指标
    setInterval(() => {
      this.collectSystemMetrics();
    }, 5000);
  }

  private async collectSystemMetrics() {
    try {
      const memUsage = process.memoryUsage();
      this.memoryUsage.set(memUsage.heapUsed);

      // 收集CPU使用率
      const startUsage = process.cpuUsage();
      await new Promise(resolve => setTimeout(resolve, 100));
      const endUsage = process.cpuUsage(startUsage);
      const cpuPercent = (endUsage.user + endUsage.system) / 1000000;
      this.cpuUsage.set(cpuPercent);
    } catch (error) {
      this.logger.error('Error collecting system metrics:', error);
    }
  }

  // 记录请求
  recordRequest(method: string, path: string, status: number, duration: number) {
    this.requestCounter.labels(method, path, status.toString()).inc();
    this.responseTimeHistogram.labels(method, path).observe(duration);
  }

  // 记录错误
  recordError(type: string, service: string) {
    this.errorCounter.labels(type, service).inc();
  }

  // 更新活跃连接数
  updateActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  // 记录GC时间
  recordGCDuration(duration: number) {
    this.gcDuration.observe(duration);
  }

  // 获取所有指标
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
} 