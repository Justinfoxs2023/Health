import { Injectable } from '@nestjs/common';
import { LocalCacheService } from './local-cache.service';
import { DistributedCacheService } from './distributed-cache.service';
import { Logger } from '../logger/logger.service';

@Injectable()
export class MultiLevelCacheService {
  private readonly logger = new Logger(MultiLevelCacheService.name);

  constructor(
    private readonly localCache: LocalCacheService,
    private readonly distributedCache: DistributedCacheService
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      // 先从本地缓存获取
      const localValue = await this.localCache.get<T>(key);
      if (localValue) {
        this.logger.debug(`Cache hit (local): ${key}`);
        return localValue;
      }

      // 从分布式缓存获取
      const distributedValue = await this.distributedCache.get<T>(key);
      if (distributedValue) {
        this.logger.debug(`Cache hit (distributed): ${key}`);
        // 回填本地缓存
        await this.localCache.set(key, distributedValue);
        return distributedValue;
      }

      this.logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, options?: {
    localTtl?: number;
    distributedTtl?: number;
    writePattern?: 'write-through' | 'write-behind';
  }): Promise<void> {
    const { localTtl, distributedTtl, writePattern = 'write-through' } = options || {};

    try {
      if (writePattern === 'write-through') {
        // 同步写入两级缓存
        await Promise.all([
          this.localCache.set(key, value, localTtl),
          this.distributedCache.set(key, value, distributedTtl)
        ]);
      } else {
        // 异步写入分布式缓存
        await this.localCache.set(key, value, localTtl);
        setImmediate(() => {
          this.distributedCache.set(key, value, distributedTtl)
            .catch(error => this.logger.error('Error in write-behind:', error));
        });
      }
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await Promise.all([
        this.localCache.del(key),
        this.distributedCache.del(key)
      ]);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
      throw error;
    }
  }
} 