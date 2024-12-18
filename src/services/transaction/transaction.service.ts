import {
  ITransactionService,
  TransactionStatus,
  TransactionOptions,
  TransactionMetadata,
} from './transaction.interface';
import { ConfigService } from '../config/config.service';
import { Counter, Histogram, Gauge } from 'prom-client';
import { DatabaseService } from '../database/database.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
/**




 * 事务服务
 * 提供健康数据事务管理、性能监控和错误处理功能
 */
@Injectable()
export class TransactionService implements ITransactionService {
  // 事务缓存
  private readonly transactionCache = new Map<string, TransactionMetadata>();

  // 性能监控指标
  private readonly transactionDuration: Histogram;
  private readonly transactionErrors: Counter;
  private readonly activeTransactions: Gauge;
  private readonly transactionRetries: Counter;
  private readonly transactionTimeouts: Counter;
  private readonly transactionSizes: Histogram;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
    @InjectMetric()
    transactionDuration: Histogram,
    @InjectMetric()
    transactionErrors: Counter,
    @InjectMetric()
    activeTransactions: Gauge,
    @InjectMetric()
    transactionRetries: Counter,
    @InjectMetric()
    transactionTimeouts: Counter,
    @InjectMetric()
    transactionSizes: Histogram,
  ) {
    this.transactionDuration = transactionDuration;
    this.transactionErrors = transactionErrors;
    this.activeTransactions = activeTransactions;
    this.transactionRetries = transactionRetries;
    this.transactionTimeouts = transactionTimeouts;
    this.transactionSizes = transactionSizes;
  }

  /**
   * 开始一个新的事务
   * @param name 事务名称
   * @param options 事务配置选项
   * @returns 事务ID
   */
  async beginTransaction(name: string, options?: TransactionOptions): Promise<string> {
    const startTime = Date.now();
    const transactionId = await this.db.beginTransaction(options?.isolationLevel);

    const metadata: TransactionMetadata = {
      id: transactionId,
      name,
      startTime,
      status: TransactionStatus.PENDING,
      options,
    };

    this.transactionCache.set(transactionId, metadata);
    this.activeTransactions.inc();
    this.logger.info(`开始事务: ${name}`, { transactionId, options });

    // 设置超时处理
    if (options?.timeout) {
      this.setupTransactionTimeout(transactionId, options.timeout);
    }

    return transactionId;
  }

  /**
   * 提交事务
   * @param transactionId 事务ID
   */
  async commitTransaction(transactionId: string): Promise<void> {
    try {
      await this.db.commitTransaction(transactionId);

      const metadata = this.transactionCache.get(transactionId);
      if (metadata) {
        metadata.status = TransactionStatus.COMMITTED;
        const duration = (Date.now() - metadata.startTime) / 1000;
        this.transactionDuration.observe(duration);

        // 记录事务大小
        const size = await this.getTransactionSize(transactionId);
        this.transactionSizes.observe(size);
      }

      this.activeTransactions.dec();
      this.logger.info(`提交事务成功`, {
        transactionId,
        duration: this.getTransactionDuration(transactionId),
      });
      this.transactionCache.delete(transactionId);
    } catch (error) {
      await this.handleTransactionError(error, transactionId);
      throw error;
    }
  }

  /**
   * 回滚事务
   * @param transactionId 事务ID
   */
  async rollbackTransaction(transactionId: string): Promise<void> {
    try {
      await this.db.rollbackTransaction(transactionId);

      const metadata = this.transactionCache.get(transactionId);
      if (metadata) {
        metadata.status = TransactionStatus.ROLLED_BACK;
      }

      this.activeTransactions.dec();
      this.transactionErrors.inc();
      this.logger.warn(`回滚事务`, { transactionId });
      this.transactionCache.delete(transactionId);
    } catch (error) {
      await this.handleTransactionError(error, transactionId);
      throw error;
    }
  }

  /**
   * 在事务中执行操作
   * @param name 事务名称
   * @param operation 要执行的操作
   * @param options 事务配置选项
   * @returns 操作结果
   */
  async executeInTransaction<T>(
    name: string,
    operation: (transactionId: string) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T> {
    let retryCount = 0;
    const maxRetries = options?.retryCount || this.config.get('transaction.maxRetries', 3);

    while (true) {
      const transactionId = await this.beginTransaction(name, options);

      try {
        const result = await operation(transactionId);
        await this.commitTransaction(transactionId);
        return result;
      } catch (error) {
        await this.rollbackTransaction(transactionId);

        if (this.shouldRetryTransaction(error) && retryCount < maxRetries) {
          retryCount++;
          this.transactionRetries.inc();
          this.logger.warn(`重试事务`, { transactionId, retryCount, maxRetries });
          continue;
        }

        throw error;
      }
    }
  }

  /**
   * 获取事务状态
   * @param transactionId 事务ID
   */
  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const metadata = this.transactionCache.get(transactionId);
    return metadata?.status || TransactionStatus.FAILED;
  }

  /**
   * 获取事务元数据
   * @param transactionId 事务ID
   */
  async getTransactionMetadata(transactionId: string): Promise<TransactionMetadata> {
    const metadata = this.transactionCache.get(transactionId);
    if (!metadata) {
      throw new Error(`事务不存在: ${transactionId}`);
    }
    return metadata;
  }

  /**
   * 获取活跃事务数量
   */
  getActiveTransactionsCount(): number {
    return this.activeTransactions.get().values[0].value;
  }

  /**
   * 设置事务超时处理
   */
  private setupTransactionTimeout(transactionId: string, timeout: number): void {
    setTimeout(async () => {
      const metadata = this.transactionCache.get(transactionId);
      if (metadata?.status === TransactionStatus.PENDING) {
        this.transactionTimeouts.inc();
        this.logger.warn(`事务超时`, { transactionId, timeout });
        await this.rollbackTransaction(transactionId);
      }
    }, timeout);
  }

  /**
   * 获取事务大小（字节）
   */
  private async getTransactionSize(transactionId: string): Promise<number> {
    // TODO: 实现实际的事务大小计算逻辑
    return 1000;
  }

  /**
   * 获取事务持续时间（秒）
   */
  private getTransactionDuration(transactionId: string): number {
    const metadata = this.transactionCache.get(transactionId);
    return metadata ? (Date.now() - metadata.startTime) / 1000 : 0;
  }

  /**
   * 判断是否应该重试事务
   */
  private shouldRetryTransaction(error: Error): boolean {
    // TODO: 实现实际的重试判断逻辑
    return (
      error.message.includes('deadlock') ||
      error.message.includes('lock timeout') ||
      error.message.includes('connection lost')
    );
  }

  /**
   * 处理事务错误
   */
  private async handleTransactionError(error: Error, transactionId: string): Promise<void> {
    const metadata = this.transactionCache.get(transactionId);
    if (metadata) {
      metadata.status = TransactionStatus.FAILED;
    }

    this.transactionErrors.inc();
    this.logger.error(`事务错误`, {
      transactionId,
      error: error.message,
      stack: error.stack,
      duration: this.getTransactionDuration(transactionId),
    });
  }
}
