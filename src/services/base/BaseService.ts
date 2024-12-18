import { CircuitBreaker } from '../reliability/CircuitBreaker';
import { DataCompressor } from '../optimization/DataCompressor';
import { EventBus, IEventSubscription } from '../communication/EventBus';
import { HealthCheck } from '../monitoring/HealthCheck';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { ServiceEvents, EventSource, EventPriority } from '../communication/events';
import { ServiceStatus } from '../ServiceRegistry';
import { injectable, inject } from 'inversify';

/**
 * 基础服务抽象类
 */
@injectable()
export abstract class BaseService {
  protected status: ServiceStatus = ServiceStatus.STOPPED;
  protected circuitBreaker: CircuitBreaker;
  protected dataCompressor: DataCompressor;
  protected healthCheck: HealthCheck;
  protected subscriptions: IEventSubscription[] = [];

  constructor(
    @inject() protected logger: Logger,
    @inject() protected metrics: MetricsCollector,
    @inject() protected eventBus: EventBus,
  ) {
    this.initializeComponents();
  }

  /**
   * 初始化组件
   */
  private initializeComponents(): void {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000,
      onOpen: () => this.handleCircuitOpen(),
      onClose: () => this.handleCircuitClose(),
    });

    this.dataCompressor = new DataCompressor({
      algorithm: 'gzip',
      compressionLevel: 6,
    });

    this.healthCheck = new HealthCheck({
      interval: 30000,
      timeout: 5000,
      onUnhealthy: error => this.handleUnhealthyState(error),
    });

    this.setupEventSubscriptions();
  }

  /**
   * 设置事件订阅
   */
  protected setupEventSubscriptions(): void {
    // 子类可以覆盖此方法来添加特定的事件订阅
  }

  /**
   * 启动服务
   */
  public async start(): Promise<void> {
    try {
      this.status = ServiceStatus.STARTING;
      this.logger.info(`正在启动服务: ${this.getName()}`);

      await this.preStart();
      await this.doStart();
      await this.postStart();

      this.status = ServiceStatus.RUNNING;
      this.logger.info(`服务启动成功: ${this.getName()}`);

      this.eventBus.publish(
        ServiceEvents.STARTED,
        {
          serviceName: this.getName(),
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.NORMAL,
        },
      );
    } catch (error) {
      this.status = ServiceStatus.ERROR;
      this.logger.error(`服务启动失败: ${this.getName()}`, error);

      this.eventBus.publish(
        ServiceEvents.FAILED,
        {
          serviceName: this.getName(),
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.HIGH,
        },
      );

      throw error;
    }
  }

  /**
   * 停止服务
   */
  public async stop(): Promise<void> {
    try {
      this.status = ServiceStatus.STOPPING;
      this.logger.info(`正在停止服务: ${this.getName()}`);

      await this.preStop();
      await this.doStop();
      await this.postStop();

      this.status = ServiceStatus.STOPPED;
      this.logger.info(`服务停止成功: ${this.getName()}`);

      // 清理事件订阅
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = [];

      this.eventBus.publish(
        ServiceEvents.STOPPED,
        {
          serviceName: this.getName(),
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.NORMAL,
        },
      );
    } catch (error) {
      this.status = ServiceStatus.ERROR;
      this.logger.error(`服务停止失败: ${this.getName()}`, error);

      this.eventBus.publish(
        ServiceEvents.FAILED,
        {
          serviceName: this.getName(),
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.HIGH,
        },
      );

      throw error;
    }
  }

  /**
   * 获取服务状态
   */
  public getStatus(): ServiceStatus {
    return this.status;
  }

  /**
   * 获取服务名称
   */
  public abstract getName(): string;

  /**
   * 执行健康检查
   */
  public async checkHealth(): Promise<boolean> {
    try {
      await this.doHealthCheck();

      this.eventBus.publish(
        ServiceEvents.HEALTH_CHECK,
        {
          serviceName: this.getName(),
          status: 'healthy',
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.LOW,
        },
      );

      return true;
    } catch (error) {
      this.logger.error(`健康检查失败: ${this.getName()}`, error);

      this.eventBus.publish(
        ServiceEvents.HEALTH_CHECK,
        {
          serviceName: this.getName(),
          status: 'unhealthy',
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
        },
        {
          source: EventSource.SERVICE,
          priority: EventPriority.HIGH,
        },
      );

      return false;
    }
  }

  /**
   * 压缩数据
   */
  protected async compressData(data: any): Promise<Buffer> {
    try {
      return await this.dataCompressor.compress(data);
    } catch (error) {
      this.logger.error('数据压缩失败', error);
      throw error;
    }
  }

  /**
   * 解压数据
   */
  protected async decompressData(data: Buffer): Promise<any> {
    try {
      return await this.dataCompressor.decompress(data);
    } catch (error) {
      this.logger.error('数据解压失败', error);
      throw error;
    }
  }

  /**
   * 执行带熔断器的操作
   */
  protected async executeWithCircuitBreaker<T>(operation: () => Promise<T>): Promise<T> {
    return this.circuitBreaker.execute(operation);
  }

  /**
   * 收集性能指标
   */
  protected collectMetrics(metrics: Record<string, number>): void {
    this.metrics.collect(this.getName(), metrics);
  }

  /**
   * 服务启动前的准备工作
   */
  protected async preStart(): Promise<void> {
    // 子类可以覆盖此方法
  }

  /**
   * 执行服务启动
   */
  protected abstract doStart(): Promise<void>;

  /**
   * 服务启动后的清理工作
   */
  protected async postStart(): Promise<void> {
    // 子类可以覆盖此方法
  }

  /**
   * 服��停止前的准备工作
   */
  protected async preStop(): Promise<void> {
    // 子类可以覆盖此方法
  }

  /**
   * 执行服务停止
   */
  protected abstract doStop(): Promise<void>;

  /**
   * 服务停止后的清理工作
   */
  protected async postStop(): Promise<void> {
    // 子类可以覆盖此方法
  }

  /**
   * 执行具体的健康检查
   */
  protected abstract doHealthCheck(): Promise<void>;

  /**
   * 处理熔断器打开事件
   */
  private handleCircuitOpen(): void {
    this.logger.warn(`服务熔断器已打开: ${this.getName()}`);
    this.metrics.increment(`${this.getName()}.circuit_breaker.open`);
  }

  /**
   * 处理熔断器关闭事件
   */
  private handleCircuitClose(): void {
    this.logger.info(`服务熔断器已关闭: ${this.getName()}`);
    this.metrics.increment(`${this.getName()}.circuit_breaker.close`);
  }

  /**
   * 处理不健康状态
   */
  private handleUnhealthyState(error: Error): void {
    this.logger.error(`服务不健康: ${this.getName()}`, error);
    this.metrics.increment(`${this.getName()}.health_check.failure`);
  }

  /**
   * 添加事件订阅
   */
  protected addSubscription(subscription: IEventSubscription): void {
    this.subscriptions.push(subscription);
  }
}
