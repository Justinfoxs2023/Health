import { Injectable, Logger } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';

export interface IErrorContext {
  /** service 的描述 */
  service: string;
  /** method 的描述 */
  method: string;
  /** params 的描述 */
  params: any;
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: number;
}

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  constructor(private readonly metricsService: MetricsService) {}

  /**
   * 处理错误
   */
  handleError(error: Error, context: IErrorContext): void {
    // 1. 记录错误日志
    this.logError(error, context);

    // 2. 记录错误指标
    this.recordErrorMetrics(error, context);

    // 3. 发送错误通知（如果需要）
    this.sendErrorNotification(error, context);
  }

  /**
   * 记录错误日志
   */
  private logError(error: Error, context: IErrorContext): void {
    const errorLog = {
      timestamp: context.timestamp || Date.now(),
      service: context.service,
      method: context.method,
      params: context.params,
      userId: context.userId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    this.logger.error(JSON.stringify(errorLog, null, 2));
  }

  /**
   * 记录错误指标
   */
  private recordErrorMetrics(error: Error, context: IErrorContext): void {
    this.metricsService.recordCustomMetric('error_count', 1, {
      service: context.service,
      method: context.method,
      error_type: error.name,
    });
  }

  /**
   * 发送错误通知
   */
  private sendErrorNotification(error: Error, context: IErrorContext): void {
    // 根据错误类型和严重程度决定是否发送通知
    if (this.shouldSendNotification(error, context)) {
      // TODO: 实现通知发送逻辑
    }
  }

  /**
   * 判断是否需要发送通知
   */
  private shouldSendNotification(error: Error, context: IErrorContext): boolean {
    // 系统级错误总是发送通知
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return true;
    }

    // 特定服务的错误可能需要通知
    const criticalServices = ['health', 'ai', 'database'];
    if (criticalServices.includes(context.service)) {
      return true;
    }

    return false;
  }

  /**
   * 创建自定义错误
   */
  createError(name: string, message: string, details?: any): Error {
    const error = new Error(message);
    error.name = name;
    (error as any).details = details;
    return error;
  }

  /**
   * 包装异步函数以添加错误处理
   */
  wrapAsync<T>(
    fn: (...args: any[]) => Promise<T>,
    context: Omit<IErrorContext, 'method'>,
  ): (...args: any[]) => Promise<T> {
    return async (...args: any[]) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error, {
          ...context,
          method: fn.name,
          params: args,
        });
        throw error;
      }
    };
  }

  /**
   * 获取错误统计
   */
  async getErrorStats(period = '1d'): Promise<any> {
    // TODO: 实现错误统计聚合逻辑
    return {};
  }

  /**
   * 分析错误模式
   */
  async analyzeErrorPatterns(period = '7d'): Promise<any> {
    // TODO: 实现错误模式分析逻辑
    return {};
  }

  /**
   * 清理过期的错误日志
   */
  async cleanupErrorLogs(maxAge = '30d'): Promise<void> {
    // TODO: 实现错误日志清理逻辑
  }
}
