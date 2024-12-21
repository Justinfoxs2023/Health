import { LoggerService } from '../logger/logger.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface IMetricData {
  /** name 的描述 */
    name: string;
  /** value 的描述 */
    value: number;
  /** tags 的描述 */
    tags: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** timestamp 的描述 */
    timestamp: number;
}

export interface IErrorData {
  /** service 的描述 */
    service: string;
  /** error 的描述 */
    error: Error;
  /** timestamp 的描述 */
    timestamp: number;
  /** context 的描述 */
    context: any;
}

export interface IActivityData {
  /** service 的描述 */
    service: string;
  /** activity 的描述 */
    activity: string;
  /** data 的描述 */
    data: any;
  /** timestamp 的描述 */
    timestamp: number;
}

export class MonitoringService {
  private metrics$ = new BehaviorSubject<IMetricData[]>([]);
  private errors$ = new Subject<IErrorData>();
  private activities$ = new Subject<IActivityData>();
  private performanceMetrics: Map<string, number> = new Map();

  constructor(private logger: LoggerService) {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // 设置性能监控
    this.setupPerformanceMonitoring();
    // 设置错误监控
    this.setupErrorMonitoring();
    // 设置活动监控
    this.setupActivityMonitoring();
  }

  // 记录指标
  recordMetric(name: string, value: number, tags: Record<string, string> = {}): void {
    const metricData: IMetricData = {
      name,
      value,
      tags,
      timestamp: Date.now()
    };

    const currentMetrics = this.metrics$.value;
    this.metrics$.next([...currentMetrics, metricData]);
    this.logger.debug('Metric recorded', metricData);
  }

  // 记录错误
  recordError(service: string, error: Error, context?: any): void {
    const errorData: IErrorData = {
      service,
      error,
      context,
      timestamp: Date.now()
    };

    this.errors$.next(errorData);
    this.logger.error('Error recorded', errorData);
  }

  // 记录活动
  recordActivity(service: string, activity: string, data?: any): void {
    const activityData: IActivityData = {
      service,
      activity,
      data,
      timestamp: Date.now()
    };

    this.activities$.next(activityData);
    this.logger.info('Activity recorded', activityData);
  }

  // 获取指标流
  getMetrics(): Observable<IMetricData[]> {
    return this.metrics$.asObservable();
  }

  // 获取错误流
  getErrors(): Observable<IErrorData> {
    return this.errors$.asObservable();
  }

  // 获取活动流
  getActivities(): Observable<IActivityData> {
    return this.activities$.asObservable();
  }

  // 记录性能指标
  recordPerformanceMetric(name: string, duration: number): void {
    this.performanceMetrics.set(name, duration);
    this.recordMetric(`performance.${name}`, duration, { type: 'performance' });
  }

  // 开始性能计时
  startPerformanceTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordPerformanceMetric(name, duration);
    };
  }

  // 获取性能指标
  getPerformanceMetrics(): Map<string, number> {
    return new Map(this.performanceMetrics);
  }

  // 清除性能指标
  clearPerformanceMetrics(): void {
    this.performanceMetrics.clear();
  }

  private setupPerformanceMonitoring(): void {
    // 监控内存使用
    setInterval(() => {
      if (typeof process !== 'undefined') {
        const memoryUsage = process.memoryUsage();
        this.recordMetric('memory.heapUsed', memoryUsage.heapUsed, { type: 'memory' });
        this.recordMetric('memory.heapTotal', memoryUsage.heapTotal, { type: 'memory' });
      }
    }, 60000); // 每分钟记录一次
  }

  private setupErrorMonitoring(): void {
    this.errors$.subscribe(errorData => {
      // 可以在这里添加错误聚合和分析逻辑
      this.recordMetric('errors.count', 1, {
        service: errorData.service,
        type: 'error'
      });
    });
  }

  private setupActivityMonitoring(): void {
    this.activities$.subscribe(activityData => {
      // 可以在这里添加活动聚合和分析逻辑
      this.recordMetric('activities.count', 1, {
        service: activityData.service,
        activity: activityData.activity,
        type: 'activity'
      });
    });
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      // 执行基本的健康检查
      const metrics = this.metrics$.value;
      const isHealthy = metrics.length >= 0; // 简单检查，实际应用中需要更复杂的逻辑

      this.recordMetric('health.check', isHealthy ? 1 : 0, { type: 'health' });
      return isHealthy;
    } catch (error) {
      this.recordError('MonitoringService', error as Error);
      return false;
    }
  }
