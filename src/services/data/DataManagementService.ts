import { BaseService } from '../base/BaseService';
import { BatchProcessor } from '../optimization/BatchProcessor';
import { CacheManager } from '../cache/CacheManager';
import { ConnectionPool } from '../database/ConnectionPool';
import { DataEvents, EventSource, EventPriority } from '../communication/events';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

export interface IDataQuery {
  /** collection 的描述 */
    collection: string;
  /** filter 的描述 */
    filter: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** sort 的描述 */
    sort: Recordstring, 1  1;
  limit: number;
  skip: number;
}

export interface IDataOperation {
  /** type 的描述 */
    type: insert  update  delete;
  collection: string;
  data: any;
  filter: Recordstring, any;
}

/**
 * 数据管理服务
 */
@injectable()
export class DataManagementService extends BaseService {
  private connectionPool: ConnectionPool;
  private cacheManager: CacheManager;
  private batchProcessor: BatchProcessor;
  private readonly batchSize = 100;
  private readonly batchTimeout = 1000;

  constructor(
    @inject() logger: Logger,
    @inject() metrics: MetricsCollector,
    @inject() eventBus: EventBus,
    @inject() connectionPool: ConnectionPool,
    @inject() cacheManager: CacheManager,
  ) {
    super(logger, metrics, eventBus);
    this.connectionPool = connectionPool;
    this.cacheManager = cacheManager;
    this.initializeBatchProcessor();
  }

  /**
   * 初始化批处理器
   */
  private initializeBatchProcessor(): void {
    this.batchProcessor = new BatchProcessor({
      batchSize: this.batchSize,
      timeout: this.batchTimeout,
      processFunction: async (operations: IDataOperation[]) => {
        const connection = await this.connectionPool.acquire();
        try {
          await this.processBatch(connection, operations);
        } finally {
          await this.connectionPool.release(connection);
        }
      },
    });
  }

  /**
   * 处理批量操作
   */
  private async processBatch(connection: any, operations: IDataOperation[]): Promise<void> {
    const operationsByType = this.groupOperationsByType(operations);

    for (const [collection, typeGroups] of Object.entries(operationsByType)) {
      const { inserts, updates, deletes } = typeGroups;

      if (inserts.length > 0) {
        await connection.collection(collection).insertMany(inserts);
        await this.invalidateCache(collection);
      }

      if (updates.length > 0) {
        await Promise.all(
          updates.map(async ({ filter, data }) => {
            await connection.collection(collection).updateMany(filter, { $set: data });
            await this.invalidateCache(collection, filter);
          }),
        );
      }

      if (deletes.length > 0) {
        await Promise.all(
          deletes.map(async ({ filter }) => {
            await connection.collection(collection).deleteMany(filter);
            await this.invalidateCache(collection, filter);
          }),
        );
      }
    }
  }

  /**
   * 按类型分组操作
   */
  private groupOperationsByType(operations: IDataOperation[]): Record<
    string,
    {
      inserts: any[];
      updates: { filter: any; data: any }[];
      deletes: { filter: any }[];
    }
  > {
    const groups: Record<
      string,
      {
        inserts: any[];
        updates: { filter: any; data: any }[];
        deletes: { filter: any }[];
      }
    > = {};

    for (const operation of operations) {
      if (!groups[operation.collection]) {
        groups[operation.collection] = {
          inserts: [],
          updates: [],
          deletes: [],
        };
      }

      switch (operation.type) {
        case 'insert':
          groups[operation.collection].inserts.push(operation.data);
          break;
        case 'update':
          groups[operation.collection].updates.push({
            filter: operation.filter || {},
            data: operation.data,
          });
          break;
        case 'delete':
          groups[operation.collection].deletes.push({
            filter: operation.filter || {},
          });
          break;
      }
    }

    return groups;
  }

  /**
   * 执行查询
   */
  public async query(query: IDataQuery): Promise<any[]> {
    const cacheKey = this.generateCacheKey(query);
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      this.metrics.increment(`${this.getName()}.cache.hit`);
      return cachedResult;
    }

    this.metrics.increment(`${this.getName()}.cache.miss`);

    const connection = await this.connectionPool.acquire();
    try {
      const collection = connection.collection(query.collection);
      let queryBuilder = collection.find(query.filter || {});

      if (query.sort) {
        queryBuilder = queryBuilder.sort(query.sort);
      }
      if (query.skip) {
        queryBuilder = queryBuilder.skip(query.skip);
      }
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      const result = await queryBuilder.toArray();
      await this.cacheManager.set(cacheKey, result);
      return result;
    } finally {
      await this.connectionPool.release(connection);
    }
  }

  /**
   * 执行数据操作
   */
  public async execute(operation: IDataOperation): Promise<void> {
    await this.batchProcessor.add(operation);

    this.eventBus.publish(
      DataEvents.UPDATED,
      {
        operation,
        timestamp: Date.now(),
      },
      {
        source: EventSource.SERVICE,
        priority: EventPriority.NORMAL,
      },
    );
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(query: IDataQuery): string {
    return `${query.collection}:${JSON.stringify(query.filter)}:${JSON.stringify(query.sort)}:${
      query.limit
    }:${query.skip}`;
  }

  /**
   * 使缓存失效
   */
  private async invalidateCache(collection: string, filter?: Record<string, any>): Promise<void> {
    const pattern = filter ? `${collection}:${JSON.stringify(filter)}:*` : `${collection}:*`;

    await this.cacheManager.deletePattern(pattern);
  }

  /**
   * 获取服务名称
   */
  public getName(): string {
    return 'DataManagementService';
  }

  /**
   * 启动服务
   */
  protected async doStart(): Promise<void> {
    await this.connectionPool.initialize();
    await this.cacheManager.initialize();
    this.batchProcessor.start();
  }

  /**
   * 停止服务
   */
  protected async doStop(): Promise<void> {
    await this.batchProcessor.stop();
    await this.connectionPool.shutdown();
    await this.cacheManager.shutdown();
  }

  /**
   * 健康检查
   */
  protected async doHealthCheck(): Promise<void> {
    const connection = await this.connectionPool.acquire();
    try {
      await connection.admin().ping();
      await this.cacheManager.ping();
    } finally {
      await this.connectionPool.release(connection);
    }
  }

  /**
   * 获取性能指标
   */
  public getMetrics(): Record<string, number> {
    return {
      activeConnections: this.connectionPool.getActiveConnections(),
      waitingRequests: this.connectionPool.getWaitingRequests(),
      batchQueueSize: this.batchProcessor.getQueueSize(),
      cacheSize: this.cacheManager.getSize(),
      cacheHitRate: this.cacheManager.getHitRate(),
    };
  }
}
