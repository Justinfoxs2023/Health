import { EventEmitter } from 'events';

export interface IBatchProcessorOptions<T> {
  /** batchSize 的描述 */
  batchSize: number;
  /** timeout 的描述 */
  timeout: number;
  /** processFunction 的描述 */
  processFunction: (items: T[]) => Promise<void>;
  /** maxRetries 的描述 */
  maxRetries?: undefined | number;
  /** retryDelay 的描述 */
  retryDelay?: undefined | number;
}

interface IBatchItem<T> {
  /** data 的描述 */
  data: T;
  /** retries 的描述 */
  retries: number;
  /** resolve 的描述 */
  resolve: () => void;
  /** reject 的描述 */
  reject: (error: Error) => void;
}

/**
 * 批处理器
 */
export class BatchProcessor<T> extends EventEmitter {
  private queue: IBatchItem<T>[] = [];
  private isProcessing = false;
  private timer?: NodeJS.Timeout;
  private readonly options: Required<IBatchProcessorOptions<T>>;

  constructor(options: IBatchProcessorOptions<T>) {
    super();
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      ...options,
    };
  }

  /**
   * 启动批处理器
   */
  public start(): void {
    if (!this.timer) {
      this.scheduleProcessing();
    }
  }

  /**
   * 停止批处理器
   */
  public async stop(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    // 处理剩余的项目
    if (this.queue.length > 0) {
      await this.processQueue();
    }
  }

  /**
   * 添加项目到队列
   */
  public async add(item: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({
        data: item,
        retries: 0,
        resolve,
        reject,
      });

      if (this.queue.length >= this.options.batchSize) {
        this.processQueue();
      }
    });
  }

  /**
   * 调度处理
   */
  private scheduleProcessing(): void {
    this.timer = setTimeout(() => {
      this.processQueue();
      this.scheduleProcessing();
    }, this.options.timeout);
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const batch = this.queue.splice(0, this.options.batchSize);

    try {
      await this.processBatchWithRetry(batch);
      batch.forEach(item => item.resolve());
    } catch (error) {
      this.handleBatchError(batch, error as Error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 处理批次（带重试）
   */
  private async processBatchWithRetry(batch: IBatchItem<T>[]): Promise<void> {
    try {
      await this.options.processFunction(batch.map(item => item.data));
    } catch (error) {
      const failedBatch = batch.filter(item => item.retries < this.options.maxRetries);

      if (failedBatch.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
        failedBatch.forEach(item => item.retries++);
        await this.processBatchWithRetry(failedBatch);
      } else {
        throw error;
      }
    }
  }

  /**
   * 处理批处理错误
   */
  private handleBatchError(batch: IBatchItem<T>[], error: Error): void {
    const failedItems = batch.filter(item => item.retries >= this.options.maxRetries);
    const retryItems = batch.filter(item => item.retries < this.options.maxRetries);

    // 处理失败的项目
    failedItems.forEach(item => {
      item.reject(error);
      this.emit('itemFailed', {
        item: item.data,
        error,
        retries: item.retries,
      });
    });

    // 重新加入需要重试的项目
    if (retryItems.length > 0) {
      this.queue.unshift(...retryItems);
      this.emit('batchRetry', {
        items: retryItems.map(item => item.data),
        error,
        retryCount: Math.max(...retryItems.map(item => item.retries)),
      });
    }
  }

  /**
   * 获取队列大小
   */
  public getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * 获取处理状态
   */
  public getStatus(): Record<string, any> {
    return {
      queueSize: this.queue.length,
      isProcessing: this.isProcessing,
      batchSize: this.options.batchSize,
      timeout: this.options.timeout,
      maxRetries: this.options.maxRetries,
      retryDelay: this.options.retryDelay,
    };
  }

  /**
   * 清空队列
   */
  public clear(): void {
    const error = new Error('批处理器已清空');
    this.queue.forEach(item => item.reject(error));
    this.queue = [];
  }

  /**
   * 暂停处理
   */
  public pause(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  /**
   * 恢复处理
   */
  public resume(): void {
    if (!this.timer) {
      this.scheduleProcessing();
    }
  }

  /**
   * 获取队列中的项目
   */
  public getQueuedItems(): T[] {
    return this.queue.map(item => item.data);
  }

  /**
   * 检查项目是否在队列中
   */
  public isQueued(predicate: (item: T) => boolean): boolean {
    return this.queue.some(item => predicate(item.data));
  }

  /**
   * 移除满足条件的项目
   */
  public remove(predicate: (item: T) => boolean): number {
    const initialLength = this.queue.length;
    const error = new Error('项目已从队列中移除');

    this.queue = this.queue.filter(item => {
      const shouldRemove = predicate(item.data);
      if (shouldRemove) {
        item.reject(error);
      }
      return !shouldRemove;
    });

    return initialLength - this.queue.length;
  }
}
