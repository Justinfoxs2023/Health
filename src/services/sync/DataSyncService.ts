import { CacheManager } from '../cache/CacheManager';
import { CircuitBreaker } from '../reliability/CircuitBreaker';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface ISyncConfig {
  /** interval 的描述 */
    interval: number;
  /** batchSize 的描述 */
    batchSize: number;
  /** retryAttempts 的描述 */
    retryAttempts: number;
  /** retryDelay 的描述 */
    retryDelay: number;
}

export interface ISyncStatus {
  /** lastSyncTime 的描述 */
    lastSyncTime: number;
  /** syncInProgress 的描述 */
    syncInProgress: false | true;
  /** pendingChanges 的描述 */
    pendingChanges: number;
  /** failedAttempts 的描述 */
    failedAttempts: number;
}

export interface ISyncOperation {
  /** type 的描述 */
    type: create  update  delete;
  collection: string;
  data: any;
  timestamp: number;
  status: pending  processing  completed  failed;
  retryCount: number;
}

@injectable()
export class DataSyncService {
  private syncQueue: Map<string, ISyncOperation[]> = new Map();
  private syncStatus: Map<string, ISyncStatus> = new Map();
  private readonly defaultConfig: ISyncConfig = {
    interval: 5000, // 5秒
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 1000,
  };

  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
    @inject() private circuitBreaker: CircuitBreaker,
  ) {
    this.initialize();
  }

  /**
   * 初始化同步服务
   */
  private async initialize(): Promise<void> {
    try {
      // 恢复未完成的同步操作
      await this.recoverPendingOperations();

      // 启动同步任务
      this.startSyncTask();

      // 订阅数据变更事件
      this.subscribeToDataChanges();

      this.logger.info('数据同步服务初始化成功');
    } catch (error) {
      this.logger.error('数据同步服务初始化失败', error);
      throw error;
    }
  }

  /**
   * 添加同步操作
   */
  public async addSyncOperation(
    operation: Omit<ISyncOperation, 'status' | 'retryCount'>,
  ): Promise<void> {
    try {
      const syncOp: ISyncOperation = {
        ...operation,
        status: 'pending',
        retryCount: 0,
      };

      const queue = this.syncQueue.get(operation.collection) || [];
      queue.push(syncOp);
      this.syncQueue.set(operation.collection, queue);

      // 更新同步状态
      const status = this.getCollectionStatus(operation.collection);
      status.pendingChanges++;
      this.syncStatus.set(operation.collection, status);

      // 发布事件
      this.eventBus.publish('sync.operation.added', {
        collection: operation.collection,
        type: operation.type,
        timestamp: operation.timestamp,
      });

      this.logger.debug('添加同步操作', {
        collection: operation.collection,
        type: operation.type,
      });
    } catch (error) {
      this.logger.error('添加同步操作失败', error);
      throw error;
    }
  }

  /**
   * 获取同步状态
   */
  public getSyncStatus(collection: string): ISyncStatus {
    return this.getCollectionStatus(collection);
  }

  /**
   * 手动触发同步
   */
  public async triggerSync(collection: string): Promise<void> {
    try {
      const status = this.getCollectionStatus(collection);
      if (status.syncInProgress) {
        throw new Error('同步操作正在进行中');
      }

      await this.processSyncQueue(collection);
    } catch (error) {
      this.logger.error('手动触发同步失败', error);
      throw error;
    }
  }

  /**
   * 处理同步队列
   */
  private async processSyncQueue(collection: string): Promise<void> {
    const status = this.getCollectionStatus(collection);
    if (status.syncInProgress) {
      return;
    }

    try {
      status.syncInProgress = true;
      this.syncStatus.set(collection, status);

      const queue = this.syncQueue.get(collection) || [];
      const batch = queue.slice(0, this.defaultConfig.batchSize);

      if (batch.length === 0) {
        return;
      }

      // 使用断路器包装同步操作
      await this.circuitBreaker.execute(async () => {
        for (const operation of batch) {
          try {
            operation.status = 'processing';
            await this.executeSyncOperation(operation);
            operation.status = 'completed';
          } catch (error) {
            operation.status = 'failed';
            operation.retryCount++;

            if (operation.retryCount < this.defaultConfig.retryAttempts) {
              // 重试失败的操作
              setTimeout(() => {
                operation.status = 'pending';
                this.processSyncQueue(collection);
              }, this.defaultConfig.retryDelay * operation.retryCount);
            } else {
              this.logger.error('同步操作达到最大重试次数', {
                collection,
                operation,
              });
            }
          }
        }
      });

      // 更新队列和状态
      const remainingQueue = queue.slice(batch.length);
      this.syncQueue.set(collection, remainingQueue);

      status.lastSyncTime = Date.now();
      status.pendingChanges = remainingQueue.length;
      status.syncInProgress = false;
      this.syncStatus.set(collection, status);

      // 发布同步完成事件
      this.eventBus.publish('sync.batch.completed', {
        collection,
        batchSize: batch.length,
        remainingChanges: remainingQueue.length,
      });
    } catch (error) {
      status.syncInProgress = false;
      status.failedAttempts++;
      this.syncStatus.set(collection, status);

      this.logger.error('处理同步队列失败', error);
      throw error;
    }
  }

  /**
   * 执行同步操作
   */
  private async executeSyncOperation(operation: ISyncOperation): Promise<void> {
    try {
      switch (operation.type) {
        case 'create':
          await this.databaseService.insert(operation.collection, operation.data);
          break;
        case 'update':
          await this.databaseService.update(
            operation.collection,
            { _id: operation.data._id },
            operation.data,
          );
          break;
        case 'delete':
          await this.databaseService.delete(operation.collection, { _id: operation.data._id });
          break;
      }

      // 更新缓存
      await this.updateCache(operation);

      this.logger.debug('执行同步操作成功', {
        collection: operation.collection,
        type: operation.type,
      });
    } catch (error) {
      this.logger.error('执行同步操作失败', error);
      throw error;
    }
  }

  /**
   * 更新缓存
   */
  private async updateCache(operation: ISyncOperation): Promise<void> {
    const cacheKey = `${operation.collection}:${operation.data._id}`;

    try {
      switch (operation.type) {
        case 'create':
        case 'update':
          await this.cacheManager.set(cacheKey, operation.data);
          break;
        case 'delete':
          await this.cacheManager.delete(cacheKey);
          break;
      }
    } catch (error) {
      this.logger.error('更新缓存失败', error);
      // 缓存更新失败不影响主流程
    }
  }

  /**
   * 恢复未完成的同步操作
   */
  private async recoverPendingOperations(): Promise<void> {
    try {
      const pendingOperations = await this.databaseService.query('sync_operations', {
        status: { $in: ['pending', 'processing'] },
      });

      for (const operation of pendingOperations) {
        const queue = this.syncQueue.get(operation.collection) || [];
        queue.push({
          ...operation,
          status: 'pending',
          retryCount: 0,
        });
        this.syncQueue.set(operation.collection, queue);
      }

      this.logger.info('恢复未完成的同步操作', {
        count: pendingOperations.length,
      });
    } catch (error) {
      this.logger.error('恢复未完成的同步操作失败', error);
      throw error;
    }
  }

  /**
   * 启动同步任务
   */
  private startSyncTask(): void {
    setInterval(() => {
      for (const collection of this.syncQueue.keys()) {
        this.processSyncQueue(collection).catch(error => {
          this.logger.error('同步任务执行失败', error);
        });
      }
    }, this.defaultConfig.interval);
  }

  /**
   * 订阅数据变更事件
   */
  private subscribeToDataChanges(): void {
    this.eventBus.subscribe('data.changed', async (data: any) => {
      await this.addSyncOperation({
        type: data.type,
        collection: data.collection,
        data: data.data,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * 获取集合同步状态
   */
  private getCollectionStatus(collection: string): ISyncStatus {
    return (
      this.syncStatus.get(collection) || {
        lastSyncTime: 0,
        syncInProgress: false,
        pendingChanges: 0,
        failedAttempts: 0,
      }
    );
  }

  /**
   * 清理已完成的同步操作
   */
  private async cleanupCompletedOperations(): Promise<void> {
    try {
      const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7天前
      await this.databaseService.delete('sync_operations', {
        status: 'completed',
        timestamp: { $lt: threshold },
      });

      this.logger.info('清理已完成的同步操作');
    } catch (error) {
      this.logger.error('清理已完成的同步操作失败', error);
    }
  }
}
