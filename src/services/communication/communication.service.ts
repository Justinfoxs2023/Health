import { ErrorService } from '../error/error.service';
import { Injectable } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface IMessage {
  /** type 的描述 */
  type: string;
  /** payload 的描述 */
  payload: any;
  /** source 的描述 */
  source: string;
  /** target 的描述 */
  target: string;
  /** timestamp 的描述 */
  timestamp: number;
  /** correlationId 的描述 */
  correlationId: string;
}

@Injectable()
export class CommunicationService {
  private readonly messageSubject = new Subject<IMessage>();
  private readonly subscriptions = new Map<string, Function[]>();

  constructor(
    private readonly metricsService: MetricsService,
    private readonly errorService: ErrorService,
  ) {}

  /**
   * 发布消息
   */
  publish(message: IMessage): void {
    try {
      // 添加时间戳和相关ID
      const enhancedMessage = {
        ...message,
        timestamp: Date.now(),
        correlationId: message.correlationId || this.generateCorrelationId(),
      };

      // 记录消息指标
      this.recordMessageMetrics(enhancedMessage);

      // 发布消息
      this.messageSubject.next(enhancedMessage);
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'communication',
        method: 'publish',
        params: message,
      });
    }
  }

  /**
   * 订阅特定类型的消息
   */
  subscribe(type: string, handler: (message: IMessage) => void): () => void {
    try {
      const subscription = this.messageSubject
        .pipe(filter(message => message.type === type))
        .subscribe(handler);

      // 记录订阅
      const handlers = this.subscriptions.get(type) || [];
      handlers.push(handler);
      this.subscriptions.set(type, handlers);

      // 返回取消订阅函数
      return () => {
        subscription.unsubscribe();
        this.removeSubscription(type, handler);
      };
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'communication',
        method: 'subscribe',
        params: { type },
      });
      return () => {};
    }
  }

  /**
   * 请求-响应模式通信
   */
  request(message: IMessage, timeout = 5000): Promise<IMessage> {
    return new Promise((resolve, reject) => {
      try {
        const correlationId = this.generateCorrelationId();
        const requestMessage = { ...message, correlationId };

        // 设置超时
        const timeoutId = setTimeout(() => {
          reject(new Error(`Request timeout for message type: ${message.type}`));
        }, timeout);

        // 订阅响应
        const subscription = this.messageSubject
          .pipe(
            filter(msg => msg.correlationId === correlationId),
            map(msg => {
              clearTimeout(timeoutId);
              return msg;
            }),
          )
          .subscribe({
            next: resolve,
            error: reject,
            complete: () => subscription.unsubscribe(),
          });

        // 发送请求
        this.publish(requestMessage);
      } catch (error) {
        this.errorService.handleError(error, {
          service: 'communication',
          method: 'request',
          params: message,
        });
        reject(error);
      }
    });
  }

  /**
   * 广播消息给所有订阅者
   */
  broadcast(type: string, payload: any): void {
    try {
      this.publish({
        type,
        payload,
        source: 'broadcast',
      });
    } catch (error) {
      this.errorService.handleError(error, {
        service: 'communication',
        method: 'broadcast',
        params: { type, payload },
      });
    }
  }

  /**
   * 获取消息流
   */
  getMessageStream(): Observable<IMessage> {
    return this.messageSubject.asObservable();
  }

  /**
   * 获取特定类型的消息流
   */
  getMessageStreamByType(type: string): Observable<IMessage> {
    return this.messageSubject.pipe(filter(message => message.type === type));
  }

  /**
   * 生成相关ID
   */
  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 移除订阅
   */
  private removeSubscription(type: string, handler: Function): void {
    const handlers = this.subscriptions.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        if (handlers.length === 0) {
          this.subscriptions.delete(type);
        } else {
          this.subscriptions.set(type, handlers);
        }
      }
    }
  }

  /**
   * 记录消息指标
   */
  private recordMessageMetrics(message: IMessage): void {
    this.metricsService.recordCustomMetric('message_count', 1, {
      type: message.type,
      source: message.source,
    });
  }

  /**
   * 获取活跃订阅数量
   */
  getActiveSubscriptionCount(): number {
    return Array.from(this.subscriptions.values()).reduce(
      (total, handlers) => total + handlers.length,
      0,
    );
  }

  /**
   * 获取消息统计
   */
  getMessageStats(): any {
    // TODO: 实现消息统计逻辑
    return {};
  }

  /**
   * 清理过期的消息
   */
  cleanupExpiredMessages(): void {
    // TODO: 实现消息清理逻辑
  }
}
