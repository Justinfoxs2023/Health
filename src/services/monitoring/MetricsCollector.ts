import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MonitoringEvents, EventSource, EventPriority } from '../communication/events';
import { injectable, inject } from 'inversify';

export interface IMetricValue {
  /** value 的描述 */
    value: number;
  /** timestamp 的描述 */
    timestamp: number;
  /** labels 的描述 */
    labels: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
}

export interface IMetricDefinition {
  /** name 的描述 */
    name: string;
  /** help 的描述 */
    help: string;
  /** type 的描述 */
    type: counter  gauge  histogram;
  labels: string;
}

export interface IHistogramBucket {
  /** le 的描述 */
    le: number;
  /** count 的描述 */
    count: number;
}

export interface IHistogramOptions {
  /** buckets 的描述 */
    buckets: number;
}

/**
 * 指标收集器
 */
@injectable()
export class MetricsCollector {
  private metrics: Map<
    string,
    {
      definition: IMetricDefinition;
      values: Map<string, IMetricValue[]>;
      histogramBuckets?: Map<string, IHistogramBucket[]>;
    }
  > = new Map();

  private readonly defaultRetention = 3600; // 1小时
  private readonly maxValuesPerMetric = 1000;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
  ) {
    this.startCleanup();
  }

  /**
   * 注册指标
   */
  public registerMetric(definition: IMetricDefinition): void {
    if (this.metrics.has(definition.name)) {
      throw new Error(`指标 ${definition.name} 已存在`);
    }

    this.metrics.set(definition.name, {
      definition,
      values: new Map(),
      histogramBuckets: definition.type === 'histogram' ? new Map() : undefined,
    });

    this.logger.debug(`注册指标: ${definition.name}`, definition);
  }

  /**
   * 增加计数器值
   */
  public increment(name: string, value = 1, labels: Record<string, string> = {}): void {
    this.validateMetric(name, 'counter');
    this.addValue(name, value, labels);
  }

  /**
   * 设置仪表值
   */
  public gauge(name: string, value: number, labels: Record<string, string> = {}): void {
    this.validateMetric(name, 'gauge');
    this.addValue(name, value, labels);
  }

  /**
   * 记录直方图值
   */
  public observe(name: string, value: number, labels: Record<string, string> = {}): void {
    this.validateMetric(name, 'histogram');
    this.addHistogramValue(name, value, labels);
  }

  /**
   * 添加指标值
   */
  private addValue(name: string, value: number, labels: Record<string, string>): void {
    const metric = this.metrics.get(name)!;
    const labelKey = this.getLabelKey(labels);

    if (!metric.values.has(labelKey)) {
      metric.values.set(labelKey, []);
    }

    const values = metric.values.get(labelKey)!;
    values.push({
      value,
      timestamp: Date.now(),
      labels,
    });

    // 限制每个指标的值数量
    if (values.length > this.maxValuesPerMetric) {
      values.splice(0, values.length - this.maxValuesPerMetric);
    }

    this.emitMetricCollected(name, value, labels);
  }

  /**
   * 添加直方图值
   */
  private addHistogramValue(name: string, value: number, labels: Record<string, string>): void {
    const metric = this.metrics.get(name)!;
    const labelKey = this.getLabelKey(labels);

    if (!metric.histogramBuckets!.has(labelKey)) {
      metric.histogramBuckets!.set(labelKey, this.createHistogramBuckets());
    }

    const buckets = metric.histogramBuckets!.get(labelKey)!;
    for (const bucket of buckets) {
      if (value <= bucket.le) {
        bucket.count++;
      }
    }

    this.addValue(name, value, labels);
  }

  /**
   * 创建直方图桶
   */
  private createHistogramBuckets(): IHistogramBucket[] {
    return [
      { le: 0.005, count: 0 },
      { le: 0.01, count: 0 },
      { le: 0.025, count: 0 },
      { le: 0.05, count: 0 },
      { le: 0.1, count: 0 },
      { le: 0.25, count: 0 },
      { le: 0.5, count: 0 },
      { le: 1, count: 0 },
      { le: 2.5, count: 0 },
      { le: 5, count: 0 },
      { le: 10, count: 0 },
      { le: Infinity, count: 0 },
    ];
  }

  /**
   * 获取指标值
   */
  public getMetricValues(name: string, labels: Record<string, string> = {}): IMetricValue[] {
    this.validateMetricExists(name);
    const metric = this.metrics.get(name)!;
    const labelKey = this.getLabelKey(labels);
    return metric.values.get(labelKey) || [];
  }

  /**
   * 获取直方图数据
   */
  public getHistogramData(name: string, labels: Record<string, string> = {}): IHistogramBucket[] {
    this.validateMetric(name, 'histogram');
    const metric = this.metrics.get(name)!;
    const labelKey = this.getLabelKey(labels);
    return metric.histogramBuckets!.get(labelKey) || this.createHistogramBuckets();
  }

  /**
   * 获取所有指标定义
   */
  public getMetricDefinitions(): IMetricDefinition[] {
    return Array.from(this.metrics.values()).map(metric => metric.definition);
  }

  /**
   * 验证指标存在
   */
  private validateMetricExists(name: string): void {
    if (!this.metrics.has(name)) {
      throw new Error(`指标 ${name} 不存在`);
    }
  }

  /**
   * 验证指标类型
   */
  private validateMetric(name: string, expectedType: string): void {
    this.validateMetricExists(name);
    const metric = this.metrics.get(name)!;
    if (metric.definition.type !== expectedType) {
      throw new Error(
        `指标 ${name} 类型不匹配，期望 ${expectedType}，实际 ${metric.definition.type}`,
      );
    }
  }

  /**
   * 获取标签键
   */
  private getLabelKey(labels: Record<string, string>): string {
    return JSON.stringify(labels);
  }

  /**
   * 发送指标收集事件
   */
  private emitMetricCollected(name: string, value: number, labels: Record<string, string>): void {
    const metric = this.metrics.get(name)!;

    this.eventBus.publish(
      MonitoringEvents.METRIC_COLLECTED,
      {
        name,
        type: metric.definition.type,
        value,
        labels,
        timestamp: Date.now(),
      },
      {
        source: EventSource.MONITOR,
        priority: EventPriority.LOW,
      },
    );
  }

  /**
   * 启动清理任务
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // 每分钟清理一次
  }

  /**
   * 清理过期数据
   */
  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.defaultRetention * 1000;

    for (const metric of this.metrics.values()) {
      for (const [labelKey, values] of metric.values.entries()) {
        const newValues = values.filter(value => value.timestamp >= cutoff);
        if (newValues.length !== values.length) {
          metric.values.set(labelKey, newValues);
        }
      }
    }
  }

  /**
   * 停止收集器
   */
  public stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }

  /**
   * 重置指标
   */
  public reset(name?: string): void {
    if (name) {
      const metric = this.metrics.get(name);
      if (metric) {
        metric.values.clear();
        if (metric.histogramBuckets) {
          metric.histogramBuckets.clear();
        }
      }
    } else {
      for (const metric of this.metrics.values()) {
        metric.values.clear();
        if (metric.histogramBuckets) {
          metric.histogramBuckets.clear();
        }
      }
    }
  }

  /**
   * 导出指标数据
   */
  public export(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [name, metric] of this.metrics.entries()) {
      result[name] = {
        definition: metric.definition,
        values: Array.from(metric.values.entries()).map(([labelKey, values]) => ({
          labels: JSON.parse(labelKey),
          values: values,
        })),
      };

      if (metric.histogramBuckets) {
        result[name].histograms = Array.from(metric.histogramBuckets.entries()).map(
          ([labelKey, buckets]) => ({
            labels: JSON.parse(labelKey),
            buckets: buckets,
          }),
        );
      }
    }

    return result;
  }
}
