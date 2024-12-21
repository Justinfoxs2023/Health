import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './DatabaseService';
import { EventBus } from '../communication/EventBus';
import { IShardingConfig } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class DatabaseShardingService {
  private readonly shardConfigs: Map<string, IShardingConfig> = new Map();
  private readonly shardRoutes: Map<string, string> = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
  ) {}

  async initializeSharding(collection: string, config: IShardingConfig): Promise<void> {
    try {
      // 验证分片配置
      this.validateShardingConfig(config);

      // 创建分片
      await this.createShards(collection, config);

      // 更新分片配置
      this.shardConfigs.set(collection, config);

      // 创建索引
      await this.createShardIndexes(collection, config);

      // 发送分片初始化事件
      await this.eventBus.emit('sharding.initialized', {
        collection,
        config,
      });
    } catch (error) {
      this.logger.error('初始化分片失败', error);
      throw error;
    }
  }

  private validateShardingConfig(config: IShardingConfig): void {
    if (!config.shardKey) {
      throw new Error('分片键不能为空');
    }

    if (config.shardCount < 1) {
      throw new Error('分片数量必须大于0');
    }

    if (!config.shardingStrategy) {
      throw new Error('分片策略不能为空');
    }
  }

  private async createShards(collection: string, config: IShardingConfig): Promise<void> {
    for (let i = 0; i < config.shardCount; i++) {
      const shardName = `${collection}_shard_${i}`;
      await this.databaseService.createCollection(shardName);

      // 创建分片元数据
      await this.databaseService.create('shard_metadata', {
        collection,
        shardName,
        shardIndex: i,
        shardKey: config.shardKey,
        rangeStart: this.calculateShardRange(i, config),
        rangeEnd: this.calculateShardRange(i + 1, config),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  private calculateShardRange(index: number, config: IShardingConfig): any {
    if (config.shardingStrategy === 'hash') {
      return (index * 0xffffffff) / config.shardCount;
    } else {
      // 范围分片的范围计算
      return config.ranges ? config.ranges[index] : null;
    }
  }

  private async createShardIndexes(collection: string, config: IShardingConfig): Promise<void> {
    for (let i = 0; i < config.shardCount; i++) {
      const shardName = `${collection}_shard_${i}`;

      // 创建分片键索引
      await this.databaseService.createIndex(shardName, {
        [config.shardKey]: 1,
      });

      // 创建其他必要索引
      if (config.indexes) {
        for (const index of config.indexes) {
          await this.databaseService.createIndex(shardName, index.keys, index.options);
        }
      }
    }
  }

  async getShardForKey(collection: string, key: any): Promise<string> {
    try {
      const config = this.shardConfigs.get(collection);
      if (!config) {
        throw new Error('集合未配置分片');
      }

      // 从缓存获取路由
      const cacheKey = `shard_route:${collection}:${key}`;
      const cachedShard = await this.cacheService.get(cacheKey);
      if (cachedShard) {
        return cachedShard;
      }

      // 计算分片
      const shardIndex = this.calculateShardIndex(key, config);
      const shardName = `${collection}_shard_${shardIndex}`;

      // 更新缓存
      await this.cacheService.set(cacheKey, shardName, 300); // 5分钟缓存

      return shardName;
    } catch (error) {
      this.logger.error('获取分片失败', error);
      throw error;
    }
  }

  private calculateShardIndex(key: any, config: IShardingConfig): number {
    if (config.shardingStrategy === 'hash') {
      const hash = this.hashKey(key);
      return hash % config.shardCount;
    } else {
      // 范围分片的分片选择
      return this.findRangeShard(key, config);
    }
  }

  private hashKey(key: any): number {
    let hash = 0;
    const str = key.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private findRangeShard(key: any, config: IShardingConfig): number {
    for (let i = 0; i < config.shardCount; i++) {
      const rangeStart = this.calculateShardRange(i, config);
      const rangeEnd = this.calculateShardRange(i + 1, config);

      if (key >= rangeStart && (!rangeEnd || key < rangeEnd)) {
        return i;
      }
    }
    return 0;
  }

  async rebalanceShards(collection: string): Promise<void> {
    try {
      const config = this.shardConfigs.get(collection);
      if (!config) {
        throw new Error('集合未配置分片');
      }

      // 获取分片统计信息
      const shardStats = await this.getShardStats(collection);

      // 计算负载不均衡度
      const imbalance = this.calculateImbalance(shardStats);
      if (imbalance < 0.2) {
        // 负载不均衡度小于20%时不需要重平衡
        return;
      }

      // 创建迁移计划
      const migrationPlan = this.createMigrationPlan(shardStats, config);

      // 执行数据迁移
      await this.executeMigrationPlan(collection, migrationPlan);

      // 发送重平衡完成事件
      await this.eventBus.emit('sharding.rebalanced', {
        collection,
        migrationPlan,
      });
    } catch (error) {
      this.logger.error('重平衡分片失败', error);
      throw error;
    }
  }

  private async getShardStats(collection: string): Promise<any[]> {
    const stats = [];
    const config = this.shardConfigs.get(collection);

    for (let i = 0; i < config.shardCount; i++) {
      const shardName = `${collection}_shard_${i}`;
      const count = await this.databaseService.count(shardName, {});
      const size = await this.databaseService.getCollectionSize(shardName);

      stats.push({
        shardName,
        shardIndex: i,
        documentCount: count,
        size,
        load: size / count, // 平均文档大小作为负载指标
      });
    }

    return stats;
  }

  private calculateImbalance(shardStats: any[]): number {
    const loads = shardStats.map(stat => stat.load);
    const avgLoad = loads.reduce((sum, load) => sum + load, 0) / loads.length;
    const maxLoad = Math.max(...loads);
    return (maxLoad - avgLoad) / avgLoad;
  }

  private createMigrationPlan(shardStats: any[], config: IShardingConfig): any[] {
    const plan = [];
    const avgLoad = shardStats.reduce((sum, stat) => sum + stat.load, 0) / shardStats.length;

    // 找出过载和负载不足的分片
    const overloadedShards = shardStats.filter(stat => stat.load > avgLoad * 1.1);
    const underloadedShards = shardStats.filter(stat => stat.load < avgLoad * 0.9);

    // 创建迁移任务
    for (const source of overloadedShards) {
      const excess = source.load - avgLoad;
      for (const target of underloadedShards) {
        const capacity = avgLoad - target.load;
        if (capacity > 0) {
          const amount = Math.min(excess, capacity);
          plan.push({
            source: source.shardName,
            target: target.shardName,
            amount,
          });
        }
      }
    }

    return plan;
  }

  private async executeMigrationPlan(collection: string, plan: any[]): Promise<void> {
    for (const task of plan) {
      try {
        // 开始迁移任务
        await this.eventBus.emit('sharding.migration_started', { task });

        // 查找需要迁移的文档
        const documents = await this.databaseService.find(task.source, {}, { limit: task.amount });

        // 迁移文档
        for (const doc of documents) {
          await this.databaseService.create(task.target, doc);
          await this.databaseService.delete(task.source, { _id: doc._id });
        }

        // 更新路由缓存
        await this.updateRouteCache(collection, documents);

        // 完成迁移任务
        await this.eventBus.emit('sharding.migration_completed', { task });
      } catch (error) {
        this.logger.error('执行迁移任务失败', error);
        await this.eventBus.emit('sharding.migration_failed', {
          task,
          error,
        });
        throw error;
      }
    }
  }

  private async updateRouteCache(collection: string, documents: any[]): Promise<void> {
    const config = this.shardConfigs.get(collection);
    for (const doc of documents) {
      const key = doc[config.shardKey];
      const cacheKey = `shard_route:${collection}:${key}`;
      await this.cacheService.delete(cacheKey);
    }
  }

  async addShard(collection: string): Promise<void> {
    try {
      const config = this.shardConfigs.get(collection);
      if (!config) {
        throw new Error('集合未配置分片');
      }

      // 创建新分片
      const newShardIndex = config.shardCount;
      const newShardName = `${collection}_shard_${newShardIndex}`;
      await this.databaseService.createCollection(newShardName);

      // 更新分片配置
      config.shardCount++;
      this.shardConfigs.set(collection, config);

      // 创建索引
      await this.createShardIndexes(collection, config);

      // 重新平衡数据
      await this.rebalanceShards(collection);

      // 发送分片添加事件
      await this.eventBus.emit('sharding.shard_added', {
        collection,
        newShardName,
      });
    } catch (error) {
      this.logger.error('添加分片失败', error);
      throw error;
    }
  }

  async removeShard(collection: string, shardIndex: number): Promise<void> {
    try {
      const config = this.shardConfigs.get(collection);
      if (!config) {
        throw new Error('集合未配置分片');
      }

      if (shardIndex >= config.shardCount) {
        throw new Error('分片索引无效');
      }

      // 迁移数据到其他分片
      await this.migrateShardData(collection, shardIndex);

      // 删除分片
      const shardName = `${collection}_shard_${shardIndex}`;
      await this.databaseService.dropCollection(shardName);

      // 更新分片配置
      config.shardCount--;
      this.shardConfigs.set(collection, config);

      // 重新平衡数据
      await this.rebalanceShards(collection);

      // 发送分片删除事件
      await this.eventBus.emit('sharding.shard_removed', {
        collection,
        shardName,
      });
    } catch (error) {
      this.logger.error('删除分片失败', error);
      throw error;
    }
  }

  private async migrateShardData(collection: string, shardIndex: number): Promise<void> {
    const config = this.shardConfigs.get(collection);
    const shardName = `${collection}_shard_${shardIndex}`;

    // 获取分片中的所有数据
    const documents = await this.databaseService.find(shardName, {});

    // 重新分配数据到其他分片
    for (const doc of documents) {
      const targetShardIndex = this.calculateShardIndex(doc[config.shardKey], {
        ...config,
        shardCount: config.shardCount - 1,
      });

      const targetShardName = `${collection}_shard_${targetShardIndex}`;
      await this.databaseService.create(targetShardName, doc);
    }

    // 清除路由缓存
    await this.updateRouteCache(collection, documents);
  }

  async getShardingStatus(collection: string): Promise<any> {
    try {
      const config = this.shardConfigs.get(collection);
      if (!config) {
        throw new Error('集合未配置分片');
      }

      const shardStats = await this.getShardStats(collection);
      const imbalance = this.calculateImbalance(shardStats);

      return {
        collection,
        config,
        shardStats,
        imbalance,
        needsRebalancing: imbalance >= 0.2,
      };
    } catch (error) {
      this.logger.error('获取分片状态失败', error);
      throw error;
    }
  }
}
