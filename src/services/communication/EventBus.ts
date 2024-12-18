import { EventEmitter } from 'events';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IEventMetadata {
  /** timestamp 的描述 */
    timestamp: number;
  /** source 的描述 */
    source: string;
  /** correlationId 的描述 */
    correlationId: string;
  /** priority 的描述 */
    priority: low  normal  high;
  retry: {
    count: number;
    delay: number;
  };
}

export interface IEventMessage<T = any> {
  /** type 的描述 */
    type: string;
  /** data 的描述 */
    data: T;
  /** metadata 的描述 */
    metadata: IEventMetadata;
}

export interface IEventSubscription {
  /** unsubscribe 的描述 */
    unsubscribe: void;
}

export interface IEventFilter {
  /** type 的描述 */
    type: string  /** RegExp 的描述 */
    /** RegExp 的描述 */
    RegExp;
  /** source 的描述 */
    source: string  /** RegExp 的描述 */
    /** RegExp 的描述 */
    RegExp;
  /** priority 的描述 */
    priority: low  normal  high;
}

/**
 * 事件总线类
 */
@injectable()
export class EventBus {
  private eventEmitter: EventEmitter;
  private subscriptions: Map<string, Set<Function>>;
  private messageQueue: Map<string, IEventMessage[]>;
  private retryTimers: Map<string, NodeJS.Timeout>;

  constructor(@inject() private logger: Logger) {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(0); // 不限制监听器数量
    this.subscriptions = new Map();
    this.messageQueue = new Map();
    this.retryTimers = new Map();
  }

  /**
   * 发布事件
   */
  public publish<T>(type: string, data: T, metadata: Partial<IEventMetadata> = {}): void {
    const eventMessage: IEventMessage<T> = {
      type,
      data,
      metadata: {
        timestamp: Date.now(),
        source: metadata.source || 'unknown',
        correlationId: metadata.correlationId || this.generateCorrelationId(),
        priority: metadata.priority || 'normal',
        retry: metadata.retry,
      },
    };

    this.logger.debug(`发布事件: ${type}`, { metadata: eventMessage.metadata });

    try {
      this.eventEmitter.emit(type, eventMessage);
      this.processMessageQueue(type);
    } catch (error) {
      this.logger.error(`事件处理错误: ${type}`, error);
      if (eventMessage.metadata.retry) {
        this.handleRetry(eventMessage);
      }
    }
  }

  /**
   * 订阅事件
   */
  public subscribe<T>(
    filter: IEventFilter,
    handler: (message: IEventMessage<T>) => void | Promise<void>,
  ): IEventSubscription {
    const subscriptionId = this.generateSubscriptionId();

    const wrappedHandler = async (message: IEventMessage<T>) => {
      if (this.matchesFilter(message, filter)) {
        try {
          await handler(message);
        } catch (error) {
          this.logger.error(`事件处理错误: ${message.type}`, error);
          if (message.metadata.retry) {
            this.handleRetry(message);
          }
        }
      }
    };

    if (!this.subscriptions.has(filter.type || '*')) {
      this.subscriptions.set(filter.type || '*', new Set());
    }
    this.subscriptions.get(filter.type || '*')!.add(wrappedHandler);

    this.eventEmitter.on(filter.type || '*', wrappedHandler);

    return {
      unsubscribe: () => {
        this.eventEmitter.off(filter.type || '*', wrappedHandler);
        const handlers = this.subscriptions.get(filter.type || '*');
        if (handlers) {
          handlers.delete(wrappedHandler);
          if (handlers.size === 0) {
            this.subscriptions.delete(filter.type || '*');
          }
        }
      },
    };
  }

  /**
   * 处理重试
   */
  private handleRetry(message: IEventMessage): void {
    const { correlationId, retry } = message.metadata;
    if (!retry || retry.count <= 0) return;

    const queueKey = `${message.type}:${correlationId}`;
    if (!this.messageQueue.has(queueKey)) {
      this.messageQueue.set(queueKey, []);
    }
    this.messageQueue.get(queueKey)!.push({
      ...message,
      metadata: {
        ...message.metadata,
        retry: {
          ...retry,
          count: retry.count - 1,
        },
      },
    });

    if (!this.retryTimers.has(queueKey)) {
      const timer = setTimeout(() => {
        this.processMessageQueue(message.type);
      }, retry.delay);
      this.retryTimers.set(queueKey, timer);
    }
  }

  /**
   * 处理消息队列
   */
  private processMessageQueue(type: string): void {
    for (const [queueKey, messages] of this.messageQueue.entries()) {
      if (queueKey.startsWith(`${type}:`)) {
        const message = messages.shift();
        if (message) {
          this.publish(message.type, message.data, message.metadata);
        }
        if (messages.length === 0) {
          this.messageQueue.delete(queueKey);
          const timer = this.retryTimers.get(queueKey);
          if (timer) {
            clearTimeout(timer);
            this.retryTimers.delete(queueKey);
          }
        }
      }
    }
  }

  /**
   * 检查消息是否匹配过滤器
   */
  private matchesFilter(message: IEventMessage, filter: IEventFilter): boolean {
    if (filter.type && !this.matchPattern(message.type, filter.type)) {
      return false;
    }
    if (filter.source && !this.matchPattern(message.metadata.source, filter.source)) {
      return false;
    }
    if (filter.priority && message.metadata.priority !== filter.priority) {
      return false;
    }
    return true;
  }

  /**
   * 匹配模式
   */
  private matchPattern(value: string, pattern: string | RegExp): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(value);
    }
    return value === pattern;
  }

  /**
   * 生成关联ID
   */
  private generateCorrelationId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * 生成订阅ID
   */
  private generateSubscriptionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * 获取活跃订阅数量
   */
  public getActiveSubscriptionsCount(): number {
    let count = 0;
    for (const handlers of this.subscriptions.values()) {
      count += handlers.size;
    }
    return count;
  }

  /**
   * 获取待处理消息数量
   */
  public getPendingMessagesCount(): number {
    let count = 0;
    for (const messages of this.messageQueue.values()) {
      count += messages.length;
    }
    return count;
  }

  /**
   * 清理所有订阅
   */
  public clearAllSubscriptions(): void {
    this.eventEmitter.removeAllListeners();
    this.subscriptions.clear();
    this.messageQueue.clear();
    for (const timer of this.retryTimers.values()) {
      clearTimeout(timer);
    }
    this.retryTimers.clear();
  }
}
