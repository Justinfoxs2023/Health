import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '../communication/EventBus';
import { ICacheConfig, ICachePattern, ICacheStats } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class CacheManagerService {
  private readonly localCache: Map<string, any> = new Map();
  private readonly redisClient: Redis.Redis;
  private readonly patterns: Map<string, ICachePattern> = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
  ) {
    // 初始化Redis客户端
    this.redisClient = new Redis({
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
      password: this.configService.get('redis.password'),
      db: this.configService.get('redis.db'),
    });

    // 订阅缓存同步事件
    this.redisClient.subscribe('cache:sync');
    this.redisClient.on('message', this.handleCacheSync.bind(this));
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      // 设置本地缓存
      this.setLocalCache(key, value, ttl);

      // 设置Redis缓存
      await this.setRedisCache(key, value, ttl);

      // 发布缓存更新事件
      await this.publishCacheUpdate(key, value, ttl);
    } catch (error) {
      this.logger.error('设置缓存失败', error);
      throw error;
    }
  }

  private setLocalCache(key: string, value: any, ttl?: number): void {
    const entry = {
      value,
      expireAt: ttl ? Date.now() + ttl * 1000 : undefined,
    };

    this.localCache.set(key, entry);

    // 如果设置了过期时间，创建定时器清除缓存
    if (ttl) {
      setTimeout(() => {
        this.localCache.delete(key);
      }, ttl * 1000);
    }
  }

  private async setRedisCache(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.setex(key, ttl, serializedValue);
    } else {
      await this.redisClient.set(key, serializedValue);
    }
  }

  private async publishCacheUpdate(key: string, value: any, ttl?: number): Promise<void> {
    await this.redisClient.publish(
      'cache:sync',
      JSON.stringify({
        type: 'update',
        key,
        value,
        ttl,
      }),
    );
  }

  async get(key: string): Promise<any> {
    try {
      // 先从本地缓存获取
      const localValue = this.getLocalCache(key);
      if (localValue !== undefined) {
        return localValue;
      }

      // 从Redis获取
      const redisValue = await this.getRedisCache(key);
      if (redisValue !== undefined) {
        // 更新本地缓存
        this.setLocalCache(key, redisValue);
        return redisValue;
      }

      return undefined;
    } catch (error) {
      this.logger.error('获取缓存失败', error);
      throw error;
    }
  }

  private getLocalCache(key: string): any {
    const entry = this.localCache.get(key);
    if (!entry) {
      return undefined;
    }

    // 检查是否过期
    if (entry.expireAt && entry.expireAt <= Date.now()) {
      this.localCache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  private async getRedisCache(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    if (!value) {
      return undefined;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      // 删除本地缓存
      this.localCache.delete(key);

      // 删除Redis缓存
      await this.redisClient.del(key);

      // 发布缓存删除事件
      await this.redisClient.publish(
        'cache:sync',
        JSON.stringify({
          type: 'delete',
          key,
        }),
      );
    } catch (error) {
      this.logger.error('删除缓存失败', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      // 清除本地缓存
      this.localCache.clear();

      // 清除Redis缓存
      await this.redisClient.flushdb();

      // 发布缓存清除事件
      await this.redisClient.publish(
        'cache:sync',
        JSON.stringify({
          type: 'clear',
        }),
      );
    } catch (error) {
      this.logger.error('清除缓存失败', error);
      throw error;
    }
  }

  private handleCacheSync(channel: string, message: string): void {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'update':
          this.setLocalCache(data.key, data.value, data.ttl);
          break;
        case 'delete':
          this.localCache.delete(data.key);
          break;
        case 'clear':
          this.localCache.clear();
          break;
      }
    } catch (error) {
      this.logger.error('处理缓存同步消息失败', error);
    }
  }

  async addPattern(pattern: ICachePattern): Promise<void> {
    try {
      // 验证模式配置
      this.validatePattern(pattern);

      // 保存模式配置
      this.patterns.set(pattern.pattern, pattern);

      // 发送模式添加事件
      await this.eventBus.emit('cache.pattern_added', { pattern });
    } catch (error) {
      this.logger.error('添加缓存模式失败', error);
      throw error;
    }
  }

  private validatePattern(pattern: ICachePattern): void {
    if (!pattern.pattern) {
      throw new Error('缓存模式不能为空');
    }

    if (!pattern.strategy) {
      throw new Error('缓存策略不能为空');
    }

    if (pattern.maxSize <= 0) {
      throw new Error('最大缓存大小必须大于0');
    }
  }

  async removePattern(pattern: string): Promise<void> {
    try {
      // 删除模式配置
      this.patterns.delete(pattern);

      // 清除匹配的缓存
      await this.clearPatternCache(pattern);

      // 发送模式删除事件
      await this.eventBus.emit('cache.pattern_removed', { pattern });
    } catch (error) {
      this.logger.error('删除缓存模式失败', error);
      throw error;
    }
  }

  private async clearPatternCache(pattern: string): Promise<void> {
    // 清除本地缓存
    for (const key of this.localCache.keys()) {
      if (this.matchPattern(key, pattern)) {
        this.localCache.delete(key);
      }
    }

    // 清除Redis缓存
    const keys = await this.redisClient.keys(pattern);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }

  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(key);
  }

  async getStats(): Promise<ICacheStats> {
    try {
      // 获取本地缓存统计
      const localStats = this.getLocalCacheStats();

      // 获取Redis统计
      const redisStats = await this.getRedisCacheStats();

      return {
        local: localStats,
        redis: redisStats,
      };
    } catch (error) {
      this.logger.error('获取缓存统计失败', error);
      throw error;
    }
  }

  private getLocalCacheStats(): any {
    let size = 0;
    let memory = 0;
    const now = Date.now();

    for (const [key, entry] of this.localCache.entries()) {
      if (!entry.expireAt || entry.expireAt > now) {
        size++;
        memory += this.estimateObjectSize(entry.value);
      }
    }

    return {
      size,
      memory,
      patterns: this.patterns.size,
    };
  }

  private async getRedisCacheStats(): Promise<any> {
    const info = await this.redisClient.info();
    const memory = parseInt(info.match(/used_memory:(\d+)/)[1]);
    const keys = parseInt(info.match(/keys=(\d+)/)[1]);

    return {
      size: keys,
      memory,
      connections: parseInt(info.match(/connected_clients:(\d+)/)[1]),
    };
  }

  private estimateObjectSize(obj: any): number {
    const str = JSON.stringify(obj);
    return str.length * 2; // 假设每个字符占用2字节
  }

  async optimize(): Promise<void> {
    try {
      // 清理过期的本地缓存
      this.cleanupLocalCache();

      // 优化Redis缓存
      await this.optimizeRedisCache();

      // 发送优化完成事件
      await this.eventBus.emit('cache.optimized', {
        stats: await this.getStats(),
      });
    } catch (error) {
      this.logger.error('优化缓存失败', error);
      throw error;
    }
  }

  private cleanupLocalCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.localCache.entries()) {
      if (entry.expireAt && entry.expireAt <= now) {
        this.localCache.delete(key);
      }
    }
  }

  private async optimizeRedisCache(): Promise<void> {
    // 获取所有键
    const keys = await this.redisClient.keys('*');

    // 批量获取TTL
    const pipeline = this.redisClient.pipeline();
    keys.forEach(key => pipeline.ttl(key));
    const ttls = await pipeline.exec();

    // 删除已过期但未被自动删除的键
    const expiredKeys = keys.filter((key, index) => ttls[index][1] === -2);
    if (expiredKeys.length > 0) {
      await this.redisClient.del(...expiredKeys);
    }
  }

  async warmup(patterns: string[]): Promise<void> {
    try {
      for (const pattern of patterns) {
        // 获取匹配的键
        const keys = await this.redisClient.keys(pattern);

        // 批量获取值
        const pipeline = this.redisClient.pipeline();
        keys.forEach(key => pipeline.get(key));
        const values = await pipeline.exec();

        // 更新本地缓存
        keys.forEach((key, index) => {
          const value = values[index][1];
          if (value) {
            try {
              this.setLocalCache(key, JSON.parse(value));
            } catch {
              this.setLocalCache(key, value);
            }
          }
        });
      }

      // 发送预热完成事件
      await this.eventBus.emit('cache.warmed_up', { patterns });
    } catch (error) {
      this.logger.error('预热缓存失败', error);
      throw error;
    }
  }
}
