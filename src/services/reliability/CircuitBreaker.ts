import { EventEmitter } from 'events';

export interface ICircuitBreakerOptions {
  /** failureThreshold 的描述 */
  failureThreshold: number;
  /** resetTimeout 的描述 */
  resetTimeout: number;
  /** onOpen 的描述 */
  onOpen: void;
  /** onClose 的描述 */
  onClose: void;
  /** onHalfOpen 的描述 */
  onHalfOpen: void;
}

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * 熔断器类
 */
export class CircuitBreaker extends EventEmitter {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private resetTimer?: NodeJS.Timeout;

  constructor(private options: ICircuitBreakerOptions) {
    super();
    this.failureThreshold = options.failureThreshold;
    this.resetTimeout = options.resetTimeout;

    // 注册事件处理器
    if (options.onOpen) {
      this.on('open', options.onOpen);
    }
    if (options.onClose) {
      this.on('close', options.onClose);
    }
    if (options.onHalfOpen) {
      this.on('half-open', options.onHalfOpen);
    }
  }

  /**
   * 执行受保护的操作
   */
  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  /**
   * 处理成功操作
   */
  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToClosed();
    }
    this.failureCount = 0;
  }

  /**
   * 处理失败操作
   */
  private onFailure(error: Error): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (
      this.state === CircuitState.HALF_OPEN ||
      (this.state === CircuitState.CLOSED && this.failureCount >= this.failureThreshold)
    ) {
      this.transitionToOpen();
    }
  }

  /**
   * 转换到开路状态
   */
  private transitionToOpen(): void {
    if (this.state !== CircuitState.OPEN) {
      this.state = CircuitState.OPEN;
      this.emit('open');
      this.scheduleReset();
    }
  }

  /**
   * 转换到半开路状态
   */
  private transitionToHalfOpen(): void {
    if (this.state === CircuitState.OPEN) {
      this.state = CircuitState.HALF_OPEN;
      this.emit('half-open');
    }
  }

  /**
   * 转换到闭合状态
   */
  private transitionToClosed(): void {
    if (this.state !== CircuitState.CLOSED) {
      this.state = CircuitState.CLOSED;
      this.failureCount = 0;
      this.emit('close');
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
        this.resetTimer = undefined;
      }
    }
  }

  /**
   * 判断是否应该尝试重置
   */
  private shouldAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  /**
   * 调度重置定时器
   */
  private scheduleReset(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(() => {
      if (this.state === CircuitState.OPEN) {
        this.transitionToHalfOpen();
      }
    }, this.resetTimeout);
  }

  /**
   * 获取当前状态
   */
  public getState(): CircuitState {
    return this.state;
  }

  /**
   * 获取失败计数
   */
  public getFailureCount(): number {
    return this.failureCount;
  }

  /**
   * 获取上次失败时间
   */
  public getLastFailureTime(): number {
    return this.lastFailureTime;
  }

  /**
   * 重置熔断器
   */
  public reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = 0;
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }
    this.transitionToClosed();
  }

  /**
   * 强制开路
   */
  public forceOpen(): void {
    this.transitionToOpen();
  }

  /**
   * 强制闭合
   */
  public forceClosed(): void {
    this.transitionToClosed();
  }

  /**
   * 获取配置
   */
  public getConfiguration(): ICircuitBreakerOptions {
    return { ...this.options };
  }
}
