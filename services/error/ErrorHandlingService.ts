/**
 * @fileoverview TS 文件 ErrorHandlingService.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class ErrorHandlingService {
  constructor(
    private readonly logger: Logger,
    private readonly notificationService: NotificationService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async handleError(error: Error, context?: string) {
    // 错误分类
    const errorType = this.classifyError(error);

    // 错误日志
    this.logger.error({
      type: errorType,
      message: error.message,
      context,
      stack: error.stack,
      timestamp: new Date(),
    });

    // 错误监控
    await this.monitoringService.trackError(error, {
      type: errorType,
      context,
    });

    // 错误通知
    if (this.shouldNotify(errorType)) {
      await this.notificationService.notify({
        level: 'error',
        title: `Error in ${context}`,
        message: error.message,
      });
    }

    // 错误恢复
    await this.attemptRecovery(errorType, context);
  }

  private classifyError(error: Error): ErrorType {
    // 错误分类逻辑
    if (error instanceof NetworkError) return 'network';
    if (error instanceof DatabaseError) return 'database';
    if (error instanceof ValidationError) return 'validation';
    return 'unknown';
  }

  private shouldNotify(errorType: ErrorType): boolean {
    // 通知策略
    const criticalErrors = ['database', 'network'];
    return criticalErrors.includes(errorType);
  }

  async retryOperation<T>(
    operation: () => Promise<T>,
    retryConfig: RetryConfig = defaultRetryConfig,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        await this.handleError(error, 'retry-operation');

        if (attempt < retryConfig.maxAttempts) {
          await this.delay(retryConfig.delayMs * attempt);
        }
      }
    }

    throw lastError;
  }
}
