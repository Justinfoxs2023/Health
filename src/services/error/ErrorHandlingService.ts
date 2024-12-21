import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { NotificationService } from '../notification/NotificationService';

export interface IErrorContext {
  /** service 的描述 */
  service: string;
  /** operation 的描述 */
  operation: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** data 的描述 */
  data: any;
}

@Injectable()
export class ErrorHandlingService {
  constructor(
    private readonly logger: Logger,
    private readonly metricsCollector: MetricsCollector,
    private readonly notificationService: NotificationService,
  ) {}

  async handleError(error: Error, context: IErrorContext): Promise<void> {
    // 错误日志记录
    this.logger.error(`Error in ${context.service}.${context.operation}`, {
      error,
      context,
      stack: error.stack,
    });

    // 错误指标收集
    await this.metricsCollector.incrementCounter('error_count', {
      service: context.service,
      operation: context.operation,
      error_type: error.constructor.name,
    });

    // 错误分类处理
    switch (true) {
      case error instanceof DatabaseError:
        await this.handleDatabaseError(error, context);
        break;
      case error instanceof NetworkError:
        await this.handleNetworkError(error, context);
        break;
      case error instanceof BusinessError:
        await this.handleBusinessError(error, context);
        break;
      default:
        await this.handleUnknownError(error, context);
    }

    // 错误通知
    if (this.shouldNotify(error)) {
      await this.notificationService.send({
        type: 'error',
        title: `Error in ${context.service}`,
        content: error.message,
        level: this.getErrorLevel(error),
        context,
      });
    }
  }

  private async handleDatabaseError(error: DatabaseError, context: IErrorContext): Promise<void> {
    // 数据库错误恢复机制
    await this.attemptDatabaseRecovery(context);
  }

  private async handleNetworkError(error: NetworkError, context: IErrorContext): Promise<void> {
    // 网络错误重试机制
    await this.attemptNetworkRetry(context);
  }

  private async handleBusinessError(error: BusinessError, context: IErrorContext): Promise<void> {
    // 业务错误处理
    await this.processBusinessError(error, context);
  }

  private async handleUnknownError(error: Error, context: IErrorContext): Promise<void> {
    // 未知错误处理
    await this.logUnknownError(error, context);
  }

  private shouldNotify(error: Error): boolean {
    // 判断是否需要发送通知
    return error.constructor.name !== 'BusinessError';
  }

  private getErrorLevel(error: Error): 'critical' | 'warning' | 'info' {
    // 确定错误级别
    switch (error.constructor.name) {
      case 'DatabaseError':
      case 'NetworkError':
        return 'critical';
      case 'BusinessError':
        return 'warning';
      default:
        return 'info';
    }
  }

  private async attemptDatabaseRecovery(context: IErrorContext): Promise<void> {
    // 实现数据库错误恢复逻辑
  }

  private async attemptNetworkRetry(context: IErrorContext): Promise<void> {
    // 实现网络错误重试逻辑
  }

  private async processBusinessError(error: BusinessError, context: IErrorContext): Promise<void> {
    // 实现业务错误处理逻辑
  }

  private async logUnknownError(error: Error, context: IErrorContext): Promise<void> {
    // 实现未知错误日志记录逻辑
  }
}

// 错误类型定义
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessError';
  }
}
