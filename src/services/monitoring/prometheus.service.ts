import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly registry: Registry;
  private readonly httpRequestDuration: Histogram;
  private readonly errorCounter: Counter;
  private readonly cacheHitCounter: Counter;
  private readonly cacheMissCounter: Counter;
  private readonly memoryGauge: Gauge;
  private readonly cpuGauge: Gauge;
  private readonly customMetrics: Map<string, Counter | Gauge | Histogram>;

  constructor() {
    // 创建注册表
    this.registry = new Registry();
    this.customMetrics = new Map();

    // HTTP请求持续时间
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    // 错误计数器
    this.errorCounter = new Counter({
      name: 'error_total',
      help: 'Total number of errors',
      labelNames: ['type'],
    });

    // 缓存命中计数器
    this.cacheHitCounter = new Counter({
      name: 'cache_hit_total',
      help: 'Total number of cache hits',
    });

    // 缓存未命中计数器
    this.cacheMissCounter = new Counter({
      name: 'cache_miss_total',
      help: 'Total number of cache misses',
    });

    // 内存使用量
    this.memoryGauge = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });

    // CPU使用量
    this.cpuGauge = new Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage',
      labelNames: ['type'],
    });

    // 注册默认指标
    this.registry.registerMetric(this.httpRequestDuration);
    this.registry.registerMetric(this.errorCounter);
    this.registry.registerMetric(this.cacheHitCounter);
    this.registry.registerMetric(this.cacheMissCounter);
    this.registry.registerMetric(this.memoryGauge);
    this.registry.registerMetric(this.cpuGauge);
  }

  /**
   * 记录请求持续时间
   */
  recordDuration(label: string, duration: number): void {
    this.httpRequestDuration.observe({ path: label }, duration / 1000);
  }

  /**
   * 记录HTTP请求
   */
  recordHttpRequest(path: string, method: string, status: number): void {
    this.httpRequestDuration.observe({ method, path, status }, Math.random());
  }

  /**
   * 增加错误计数
   */
  incrementErrorCount(type: string): void {
    this.errorCounter.inc({ type });
  }

  /**
   * 记录缓存命中
   */
  recordCacheHit(hit: boolean): void {
    if (hit) {
      this.cacheHitCounter.inc();
    } else {
      this.cacheMissCounter.inc();
    }
  }

  /**
   * 记录内存使用
   */
  recordMemoryUsage(used: NodeJS.MemoryUsage): void {
    Object.entries(used).forEach(([type, value]) => {
      this.memoryGauge.set({ type }, value);
    });
  }

  /**
   * 记录CPU使用
   */
  recordCpuUsage(usage: NodeJS.CpuUsage): void {
    Object.entries(usage).forEach(([type, value]) => {
      this.cpuGauge.set({ type }, value);
    });
  }

  /**
   * 记录自定义指标
   */
  recordCustomMetric(name: string, value: number, labels?: Record<string, string>): void {
    let metric = this.customMetrics.get(name);

    if (!metric) {
      // 创建新的计数器
      metric = new Counter({
        name,
        help: `Custom metric: ${name}`,
        labelNames: labels ? Object.keys(labels) : [],
      });
      this.registry.registerMetric(metric);
      this.customMetrics.set(name, metric);
    }

    if (labels) {
      (metric as Counter).inc(labels, value);
    } else {
      (metric as Counter).inc(value);
    }
  }

  /**
   * 获取所有指标
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * 重置所有指标
   */
  async resetMetrics(): Promise<void> {
    this.registry.resetMetrics();
  }

  /**
   * 清除特定指标
   */
  async clearMetric(name: string): Promise<void> {
    const metric = this.customMetrics.get(name);
    if (metric) {
      this.registry.removeSingleMetric(name);
      this.customMetrics.delete(name);
    }
  }

  /**
   * 获取指标注册表
   */
  getRegistry(): Registry {
    return this.registry;
  }
}
