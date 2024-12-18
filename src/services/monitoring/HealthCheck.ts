import { EventEmitter } from 'events';

export interface IHealthCheckOptions {
  /** interval 的描述 */
    interval: number;
  /** timeout 的描述 */
    timeout: number;
  /** onUnhealthy 的描述 */
    onUnhealthy: error: Error  void;
  onHealthy:   void;
  retryCount: number;
  retryDelay: number;
}

export interface IHealthStatus {
  /** isHealthy 的描述 */
    isHealthy: false | true;
  /** lastCheck 的描述 */
    lastCheck: number;
  /** lastError 的描述 */
    lastError: Error;
  /** checkCount 的描述 */
    checkCount: number;
  /** failureCount 的描述 */
    failureCount: number;
  /** uptime 的描述 */
    uptime: number;
  /** metrics 的描述 */
    metrics: {
    responseTime: number;
    successRate: number;
  };
}

/**
 * 健康检查类
 */
export class HealthCheck extends EventEmitter {
  private checkTimer?: NodeJS.Timeout;
  private startTime: number;
  private lastCheckTime = 0;
  private lastError?: Error;
  private checkCount = 0;
  private failureCount = 0;
  private responseTimeHistory: number[] = [];
  private readonly maxHistoryLength: number = 100;

  private readonly interval: number;
  private readonly timeout: number;
  private readonly retryCount: number;
  private readonly retryDelay: number;

  constructor(private options: IHealthCheckOptions) {
    super();
    this.interval = options.interval;
    this.timeout = options.timeout;
    this.retryCount = options.retryCount || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.startTime = Date.now();

    if (options.onUnhealthy) {
      this.on('unhealthy', options.onUnhealthy);
    }
    if (options.onHealthy) {
      this.on('healthy', options.onHealthy);
    }
  }

  /**
   * 启动健康检查
   */
  public start(checkFunction: () => Promise<void>): void {
    if (this.checkTimer) {
      this.stop();
    }

    const performCheck = async () => {
      const startTime = Date.now();
      try {
        await this.executeWithRetry(checkFunction);
        const responseTime = Date.now() - startTime;
        this.handleSuccess(responseTime);
      } catch (error) {
        this.handleFailure(error as Error);
      }
    };

    performCheck();
    this.checkTimer = setInterval(performCheck, this.interval);
  }

  /**
   * 停止健康检查
   */
  public stop(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }
  }

  /**
   * 执行带重试的检查
   */
  private async executeWithRetry(checkFunction: () => Promise<void>): Promise<void> {
    let lastError: Error | undefined;

    for (let i = 0; i <= this.retryCount; i++) {
      try {
        await Promise.race([
          checkFunction(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Health check timeout')), this.timeout);
          }),
        ]);
        return;
      } catch (error) {
        lastError = error as Error;
        if (i < this.retryCount) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    throw lastError;
  }

  /**
   * 处理成功检查
   */
  private handleSuccess(responseTime: number): void {
    this.checkCount++;
    this.lastCheckTime = Date.now();
    this.lastError = undefined;
    this.updateResponseTimeHistory(responseTime);
    this.emit('healthy');
  }

  /**
   * 处理失败检查
   */
  private handleFailure(error: Error): void {
    this.checkCount++;
    this.failureCount++;
    this.lastCheckTime = Date.now();
    this.lastError = error;
    this.emit('unhealthy', error);
  }

  /**
   * 更新响应时间历史
   */
  private updateResponseTimeHistory(responseTime: number): void {
    this.responseTimeHistory.push(responseTime);
    if (this.responseTimeHistory.length > this.maxHistoryLength) {
      this.responseTimeHistory.shift();
    }
  }

  /**
   * 获取健康状态
   */
  public getStatus(): IHealthStatus {
    const currentTime = Date.now();
    const uptime = currentTime - this.startTime;
    const successRate =
      this.checkCount > 0 ? ((this.checkCount - this.failureCount) / this.checkCount) * 100 : 100;

    return {
      isHealthy: !this.lastError,
      lastCheck: this.lastCheckTime,
      lastError: this.lastError,
      checkCount: this.checkCount,
      failureCount: this.failureCount,
      uptime,
      metrics: {
        responseTime: [...this.responseTimeHistory],
        successRate,
      },
    };
  }

  /**
   * 重置健康检查状态
   */
  public reset(): void {
    this.checkCount = 0;
    this.failureCount = 0;
    this.lastError = undefined;
    this.lastCheckTime = 0;
    this.responseTimeHistory = [];
    this.startTime = Date.now();
  }

  /**
   * 获取平均响应时间
   */
  public getAverageResponseTime(): number {
    if (this.responseTimeHistory.length === 0) {
      return 0;
    }
    const sum = this.responseTimeHistory.reduce((a, b) => a + b, 0);
    return sum / this.responseTimeHistory.length;
  }

  /**
   * 获取成功率
   */
  public getSuccessRate(): number {
    if (this.checkCount === 0) {
      return 100;
    }
    return ((this.checkCount - this.failureCount) / this.checkCount) * 100;
  }

  /**
   * 获取配置
   */
  public getConfiguration(): IHealthCheckOptions {
    return { ...this.options };
  }
}
