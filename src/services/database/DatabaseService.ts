import { ConfigurationManager } from '../config/ConfigurationManager';
import { DatabaseConfig, ShardConfig, QueryOptions } from '../types/database.types';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { MongoClient, Db, Collection } from 'mongodb';
import { ShardingStrategy } from './ShardingStrategy';
import { injectable, inject } from 'inversify';

@injectable()
export class DatabaseService {
  private shards: Map<string, Db> = new Map();
  private shardingStrategy: ShardingStrategy;
  private primaryShard: Db;

  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly config: ConfigurationManager,
  ) {
    this.initializeSharding();
  }

  /**
   * 初始化分片
   */
  private async initializeSharding(): Promise<void> {
    try {
      const dbConfig = this.config.getDatabaseConfig();
      this.shardingStrategy = new ShardingStrategy(dbConfig.sharding);

      // 连接所有分片
      await Promise.all(dbConfig.shards.map(shard => this.connectShard(shard)));

      // 设置主分片
      this.primaryShard = this.shards.get(dbConfig.primaryShard);
      if (!this.primaryShard) {
        throw new Error('主分片未配置');
      }

      this.logger.info('数据库分片初始化成功');
    } catch (error) {
      this.logger.error('数据库分片初始化失败', error as Error);
      throw error;
    }
  }

  /**
   * 连接分片
   */
  private async connectShard(config: ShardConfig): Promise<void> {
    try {
      const client = await MongoClient.connect(config.url);
      this.shards.set(config.name, client.db(config.database));
      this.logger.info(`分片 ${config.name} 连接成功`);
    } catch (error) {
      this.logger.error(`分片 ${config.name} 连接失败`, error as Error);
      throw error;
    }
  }

  /**
   * 插入文档
   */
  public async insert<T>(collection: string, document: T, options?: QueryOptions): Promise<T> {
    const timer = this.metrics.startTimer('db_insert');
    try {
      // 确定目标分片
      const targetShard = this.determineTargetShard(document);

      // 获取集合
      const col = targetShard.collection(collection);

      // 插入文档
      const result = await col.insertOne(document);

      this.metrics.increment('db_insert_success');
      return { ...document, _id: result.insertedId };
    } catch (error) {
      this.logger.error('数据插入失败', error as Error);
      this.metrics.increment('db_insert_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 批量插入文档
   */
  public async bulkInsert<T>(
    collection: string,
    documents: T[],
    options?: QueryOptions,
  ): Promise<T[]> {
    const timer = this.metrics.startTimer('db_bulk_insert');
    try {
      // 按分片分组文档
      const documentsByShards = this.groupDocumentsByShards(documents);

      // 并行插入各个分片
      const insertPromises = Array.from(documentsByShards.entries()).map(
        async ([shardName, docs]) => {
          const shard = this.shards.get(shardName);
          if (!shard) {
            throw new Error(`分片 ${shardName} 不存在`);
          }

          const col = shard.collection(collection);
          const result = await col.insertMany(docs);
          return docs.map((doc, index) => ({
            ...doc,
            _id: result.insertedIds[index],
          }));
        },
      );

      const results = await Promise.all(insertPromises);
      this.metrics.increment('db_bulk_insert_success');
      return results.flat();
    } catch (error) {
      this.logger.error('批量插入失败', error as Error);
      this.metrics.increment('db_bulk_insert_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 查询文档
   */
  public async find<T>(collection: string, query: any, options?: QueryOptions): Promise<T[]> {
    const timer = this.metrics.startTimer('db_find');
    try {
      // 确定需要查询的分片
      const targetShards = this.determineQueryShards(query);

      // 并行查询各个分片
      const queryPromises = targetShards.map(async shard => {
        const col = shard.collection(collection);
        return col.find(query, options).toArray();
      });

      // 合并结果
      const results = await Promise.all(queryPromises);
      const mergedResults = this.mergeQueryResults(results.flat());

      this.metrics.increment('db_find_success');
      return mergedResults;
    } catch (error) {
      this.logger.error('数据查询失败', error as Error);
      this.metrics.increment('db_find_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 更新文档
   */
  public async update<T>(
    collection: string,
    query: any,
    update: any,
    options?: QueryOptions,
  ): Promise<number> {
    const timer = this.metrics.startTimer('db_update');
    try {
      // 确定需要更新的分片
      const targetShards = this.determineQueryShards(query);

      // 并行更新各个分片
      const updatePromises = targetShards.map(async shard => {
        const col = shard.collection(collection);
        const result = await col.updateMany(query, update, options);
        return result.modifiedCount;
      });

      // 统计更新数量
      const results = await Promise.all(updatePromises);
      const totalModified = results.reduce((sum, count) => sum + count, 0);

      this.metrics.increment('db_update_success');
      return totalModified;
    } catch (error) {
      this.logger.error('数据更新失败', error as Error);
      this.metrics.increment('db_update_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 删除文档
   */
  public async delete(collection: string, query: any, options?: QueryOptions): Promise<number> {
    const timer = this.metrics.startTimer('db_delete');
    try {
      // 确定需要删除的分片
      const targetShards = this.determineQueryShards(query);

      // 并行删除各个分片
      const deletePromises = targetShards.map(async shard => {
        const col = shard.collection(collection);
        const result = await col.deleteMany(query, options);
        return result.deletedCount;
      });

      // 统计删除数量
      const results = await Promise.all(deletePromises);
      const totalDeleted = results.reduce((sum, count) => sum + count, 0);

      this.metrics.increment('db_delete_success');
      return totalDeleted;
    } catch (error) {
      this.logger.error('数据删除失败', error as Error);
      this.metrics.increment('db_delete_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 聚合查询
   */
  public async aggregate<T>(
    collection: string,
    pipeline: any[],
    options?: QueryOptions,
  ): Promise<T[]> {
    const timer = this.metrics.startTimer('db_aggregate');
    try {
      // 确定需要聚合的分片
      const targetShards = this.determineAggregateShards(pipeline);

      // 并行聚合各个分片
      const aggregatePromises = targetShards.map(async shard => {
        const col = shard.collection(collection);
        return col.aggregate(pipeline, options).toArray();
      });

      // 合并结果
      const results = await Promise.all(aggregatePromises);
      const mergedResults = this.mergeAggregateResults(results.flat(), pipeline);

      this.metrics.increment('db_aggregate_success');
      return mergedResults;
    } catch (error) {
      this.logger.error('聚合查询失败', error as Error);
      this.metrics.increment('db_aggregate_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 确定目标分片
   */
  private determineTargetShard(document: any): Db {
    const shardKey = this.shardingStrategy.getShardKey(document);
    const shardName = this.shardingStrategy.determineShardName(shardKey);
    const shard = this.shards.get(shardName);

    if (!shard) {
      throw new Error(`分片 ${shardName} 不存在`);
    }

    return shard;
  }

  /**
   * 按分片分组文档
   */
  private groupDocumentsByShards<T>(documents: T[]): Map<string, T[]> {
    const groups = new Map<string, T[]>();

    for (const doc of documents) {
      const shardKey = this.shardingStrategy.getShardKey(doc);
      const shardName = this.shardingStrategy.determineShardName(shardKey);

      if (!groups.has(shardName)) {
        groups.set(shardName, []);
      }

      groups.get(shardName).push(doc);
    }

    return groups;
  }

  /**
   * 确定查询分片
   */
  private determineQueryShards(query: any): Db[] {
    const shardKeys = this.shardingStrategy.getQueryShardKeys(query);

    if (shardKeys.length === 0) {
      // 如果无法确定分片键，则查询所有分片
      return Array.from(this.shards.values());
    }

    return shardKeys
      .map(key => this.shardingStrategy.determineShardName(key))
      .map(name => this.shards.get(name))
      .filter(shard => shard !== undefined);
  }

  /**
   * 确定聚合分片
   */
  private determineAggregateShards(pipeline: any[]): Db[] {
    const shardKeys = this.shardingStrategy.getAggregateShardKeys(pipeline);

    if (shardKeys.length === 0) {
      // 如果无法确定分片键，则聚合所有分片
      return Array.from(this.shards.values());
    }

    return shardKeys
      .map(key => this.shardingStrategy.determineShardName(key))
      .map(name => this.shards.get(name))
      .filter(shard => shard !== undefined);
  }

  /**
   * 合并查询结果
   */
  private mergeQueryResults<T>(results: T[]): T[] {
    // 根据查询条件排序和去重
    return Array.from(new Set(results));
  }

  /**
   * 合并聚合结果
   */
  private mergeAggregateResults<T>(results: T[], pipeline: any[]): T[] {
    // 根据聚合管道的最后一个阶段进行合并
    const lastStage = pipeline[pipeline.length - 1];

    if (lastStage.$sort) {
      return this.mergeSortedResults(results, lastStage.$sort);
    }

    if (lastStage.$group) {
      return this.mergeGroupedResults(results, lastStage.$group);
    }

    return results;
  }

  /**
   * 合并排序结果
   */
  private mergeSortedResults<T>(results: T[], sortSpec: any): T[] {
    const sortFields = Object.keys(sortSpec);

    return results.sort((a, b) => {
      for (const field of sortFields) {
        const order = sortSpec[field];
        const aValue = this.getFieldValue(a, field);
        const bValue = this.getFieldValue(b, field);

        if (aValue < bValue) return -order;
        if (aValue > bValue) return order;
      }
      return 0;
    });
  }

  /**
   * 合并分组结果
   */
  private mergeGroupedResults<T>(results: T[], groupSpec: any): T[] {
    const groupKey = groupSpec._id;
    const groups = new Map<string, any>();

    for (const result of results) {
      const key = this.getGroupKey(result, groupKey);
      if (!groups.has(key)) {
        groups.set(key, result);
      } else {
        groups.set(key, this.mergeGroupValues(groups.get(key), result, groupSpec));
      }
    }

    return Array.from(groups.values());
  }

  /**
   * 获取字段值
   */
  private getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((value, key) => value?.[key], obj);
  }

  /**
   * 获取分组键
   */
  private getGroupKey(result: any, groupKey: any): string {
    if (typeof groupKey === 'string') {
      return this.getFieldValue(result, groupKey);
    }

    const keys = Object.entries(groupKey).map(([field, expr]) => {
      if (typeof expr === 'string' && expr.startsWith('$')) {
        return this.getFieldValue(result, expr.slice(1));
      }
      return expr;
    });

    return JSON.stringify(keys);
  }

  /**
   * 合并分组值
   */
  private mergeGroupValues(a: any, b: any, groupSpec: any): any {
    const result = { _id: a._id };

    for (const [field, expr] of Object.entries(groupSpec)) {
      if (field === '_id') continue;

      if (typeof expr === 'object') {
        const operator = Object.keys(expr)[0];
        switch (operator) {
          case '$sum':
            result[field] = (a[field] || 0) + (b[field] || 0);
            break;
          case '$avg':
            result[field] = ((a[field] || 0) + (b[field] || 0)) / 2;
            break;
          case '$min':
            result[field] = Math.min(a[field] || Infinity, b[field] || Infinity);
            break;
          case '$max':
            result[field] = Math.max(a[field] || -Infinity, b[field] || -Infinity);
            break;
          case '$push':
            result[field] = [...(a[field] || []), ...(b[field] || [])];
            break;
          default:
            result[field] = a[field];
        }
      }
    }

    return result;
  }
}
