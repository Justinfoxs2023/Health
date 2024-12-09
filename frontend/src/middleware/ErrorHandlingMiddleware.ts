interface ErrorConfig {
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  retryStrategy: 'immediate' | 'exponential' | 'none';
  maxRetries: number;
  notifyUser: boolean;
}

interface ErrorLog {
  timestamp: Date;
  type: string;
  message: string;
  stack?: string;
  context?: any;
}

export class ErrorHandlingMiddleware {
  private config: ErrorConfig;
  private errorLogs: ErrorLog[] = [];
  private retryCount: Map<string, number> = new Map();

  constructor() {
    this.config = {
      logLevel: 'error',
      retryStrategy: 'exponential',
      maxRetries: 3,
      notifyUser: true
    };
  }

  // 全局错误处理
  async handleError(error: Error, context?: any): Promise<void> {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      type: error.name,
      message: error.message,
      stack: error.stack,
      context
    };

    // 记录错误
    await this.logError(errorLog);

    // 重试策略
    if (this.shouldRetry(error)) {
      await this.retryOperation(error, context);
    }

    // 用户通知
    if (this.config.notifyUser) {
      this.notifyUser(error);
    }

    // 错误上报
    await this.reportError(errorLog);
  }

  // 错误日志记录
  private async logError(error: ErrorLog): Promise<void> {
    this.errorLogs.push(error);

    // 本地存储
    try {
      const logs = await this.getStoredLogs();
      logs.push(error);
      localStorage.setItem('error-logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving log:', e);
    }

    // 控制台输出
    switch (this.config.logLevel) {
      case 'debug':
        console.debug(error);
        break;
      case 'info':
        console.info(error);
        break;
      case 'warn':
        console.warn(error);
        break;
      case 'error':
        console.error(error);
        break;
    }
  }

  // 重试策略
  private shouldRetry(error: Error): boolean {
    const retryCount = this.retryCount.get(error.message) || 0;
    return (
      this.config.retryStrategy !== 'none' &&
      retryCount < this.config.maxRetries &&
      this.isRetryableError(error)
    );
  }

  // 执行重试
  private async retryOperation(error: Error, context: any): Promise<void> {
    const retryCount = (this.retryCount.get(error.message) || 0) + 1;
    this.retryCount.set(error.message, retryCount);

    const delay = this.calculateRetryDelay(retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      if (context?.retry) {
        await context.retry();
      }
    } catch (retryError) {
      await this.handleError(retryError as Error, context);
    }
  }

  // 计算重试延迟
  private calculateRetryDelay(retryCount: number): number {
    switch (this.config.retryStrategy) {
      case 'immediate':
        return 0;
      case 'exponential':
        return Math.min(1000 * Math.pow(2, retryCount - 1), 30000);
      default:
        return 1000;
    }
  }

  // 用户通知
  private notifyUser(error: Error): void {
    // 实现用户友好的错误提示
    const userMessage = this.getUserFriendlyMessage(error);
    // 使用通知组件显示错误
    SharedComponents.Feedback.Message.error(userMessage);
  }

  // 错误上报
  private async reportError(error: ErrorLog): Promise<void> {
    try {
      await fetch('/api/error-reporting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      });
    } catch (e) {
      console.error('Error reporting failed:', e);
    }
  }

  // 获取存储的日志
  private async getStoredLogs(): Promise<ErrorLog[]> {
    try {
      const logs = localStorage.getItem('error-logs');
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  }

  // 判断错误是否可重试
  private isRetryableError(error: Error): boolean {
    // 实现错误类型判断逻辑
    return error.name === 'NetworkError' || error.name === 'TimeoutError';
  }

  // 获取用户友好的错误消息
  private getUserFriendlyMessage(error: Error): string {
    // 实现错误消息转换逻辑
    const messages: Record<string, string> = {
      NetworkError: '网络连接出现问题，请检查网络设置',
      TimeoutError: '请求超时，请稍后重试',
      ValidationError: '输入数据有误，请检查后重试',
      AuthenticationError: '登录已过期，请重新登录'
    };
    return messages[error.name] || '系统出现错误，请稍后重试';
  }

  // 清理错误日志
  async clearErrorLogs(): Promise<void> {
    this.errorLogs = [];
    localStorage.removeItem('error-logs');
  }

  // 获取错误统计
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    recentErrors: ErrorLog[];
  } {
    const byType: Record<string, number> = {};
    this.errorLogs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
    });

    return {
      total: this.errorLogs.length,
      byType,
      recentErrors: this.errorLogs.slice(-10)
    };
  }
} 