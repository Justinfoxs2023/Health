import { ConfigService } from '../config/config.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { Registry, Counter, Gauge, Histogram } from 'prom-client';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private readonly registry: Registry;
  private readonly logger = new Logger(PrometheusService.name);

  // 请求相关指标
  private readonly requestCounter: Counter;
  private readonly requestDuration: Histogram;
  private readonly activeConnections: Gauge;

  // 服务健康指标
  private readonly serviceHealth: Gauge;
  private readonly serviceUptime: Gauge;

  // 资源使用指标
  private readonly cpuUsage: Gauge;
  private readonly memoryUsage: Gauge;
  private readonly gcDuration: Histogram;

  // 业务指标
  private readonly activeUsers: Gauge;
  private readonly errorRate: Gauge;
  private readonly queueSize: Gauge;

  constructor(private readonly config: ConfigService) {
    this.registry = new Registry();
    this.initializeMetrics();
  }

  async onModuleInit() {
    this.startCollectingMetrics();
  }

  private initializeMetrics() {
    // 请求指标
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });

    this.requestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    // 服务健康指标
    this.serviceHealth = new Gauge({
      name: 'service_health_status',
      help: 'Service health status (1 = healthy, 0 = unhealthy)',
      labelNames: ['service'],
    });

    this.serviceUptime = new Gauge({
      name: 'service_uptime_seconds',
      help: 'Service uptime in seconds',
    });

    // 资源使用指标
    this.cpuUsage = new Gauge({
      name: 'process_cpu_usage',
      help: 'Process CPU usage percentage',
    });

    this.memoryUsage = new Gauge({
      name: 'process_memory_bytes',
      help: 'Process memory usage in bytes',
      labelNames: ['type'],
    });

    this.gcDuration = new Histogram({
      name: 'gc_duration_seconds',
      help: 'Garbage collection duration',
    });

    // 业务指标
    this.activeUsers = new Gauge({
      name: 'active_users',
      help: 'Number of active users',
    });

    this.errorRate = new Gauge({
      name: 'error_rate',
      help: 'Error rate percentage',
      labelNames: ['service'],
    });

    this.queueSize = new Gauge({
      name: 'queue_size',
      help: 'Current queue size',
      labelNames: ['queue'],
    });

    // 注册所有指标
    this.registry.registerMetric(this.requestCounter);
    this.registry.registerMetric(this.requestDuration);
    this.registry.registerMetric(this.activeConnections);
    this.registry.registerMetric(this.serviceHealth);
    this.registry.registerMetric(this.serviceUptime);
    this.registry.registerMetric(this.cpuUsage);
    this.registry.registerMetric(this.memoryUsage);
    this.registry.registerMetric(this.gcDuration);
    this.registry.registerMetric(this.activeUsers);
    this.registry.registerMetric(this.errorRate);
    this.registry.registerMetric(this.queueSize);
  }

  private startCollectingMetrics() {
    // 定期收集系统指标
    setInterval(() => {
      this.collectSystemMetrics();
    }, 5000);

    // 收集服务运行时间
    setInterval(() => {
      this.serviceUptime.set(process.uptime());
    }, 10000);
  }

  private async collectSystemMetrics() {
    try {
      // CPU 使用率
      const startUsage = process.cpuUsage();
      await new Promise(resolve => setTimeout(resolve, 100));
      const endUsage = process.cpuUsage(startUsage);
      const cpuPercent = (endUsage.user + endUsage.system) / 1000000;
      this.cpuUsage.set(cpuPercent);

      // 内存使用
      const memUsage = process.memoryUsage();
      this.memoryUsage.labels('heap').set(memUsage.heapUsed);
      this.memoryUsage.labels('rss').set(memUsage.rss);
      this.memoryUsage.labels('external').set(memUsage.external);
    } catch (error) {
      this.logger.error('Error collecting system metrics:', error);
    }
  }

  // 记录请求
  recordRequest(method: string, path: string, status: number, duration: number) {
    this.requestCounter.labels(method, path, status.toString()).inc();
    this.requestDuration.labels(method, path).observe(duration);
  }

  // 更新服务健康状态
  updateServiceHealth(service: string, isHealthy: boolean) {
    this.serviceHealth.labels(service).set(isHealthy ? 1 : 0);
  }

  // 更新错误率
  updateErrorRate(service: string, rate: number) {
    this.errorRate.labels(service).set(rate);
  }

  // 更新队列大小
  updateQueueSize(queue: string, size: number) {
    this.queueSize.labels(queue).set(size);
  }

  // 更新活跃用户数
  updateActiveUsers(count: number) {
    this.activeUsers.set(count);
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
