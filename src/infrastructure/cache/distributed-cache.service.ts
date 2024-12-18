import Redis, { Cluster } from 'ioredis';
import { ConfigService } from '../config/config.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class DistributedCacheService implements OnModuleInit {
  private redis: Redis | Cluster;
  private readonly logger = new Logger(DistributedCacheService.name);
  private readonly retryTimes = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    await this.initializeRedis();
    await this.setupRedisConfig();
  }

  private async initializeRedis() {
    const isCluster = this.config.get('REDIS_CLUSTER_ENABLED') === 'true';
    const nodes = this.parseRedisNodes();

    try {
      if (isCluster) {
        this.redis = new Redis.Cluster(nodes, {
          redisOptions: {
            password: this.config.get('REDIS_PASSWORD'),
            retryStrategy: times => {
              if (times > this.retryTimes) return null;
              return Math.min(times * this.retryDelay, 3000);
            },
          },
          clusterRetryStrategy: times => {
            if (times > this.retryTimes) return null;
            return Math.min(times * this.retryDelay, 3000);
          },
        });
      } else {
        this.redis = new Redis({
          host: nodes[0].host,
          port: nodes[0].port,
          password: this.config.get('REDIS_PASSWORD'),
          retryStrategy: times => {
            if (times > this.retryTimes) return null;
            return Math.min(times * this.retryDelay, 3000);
          },
        });
      }

      this.setupRedisEventHandlers();
    } catch (error) {
      this.logger.error('Failed to initialize Redis:', error);
      throw error;
    }
  }

  private async setupRedisConfig() {
    const maxMemory = this.config.get('REDIS_MAX_MEMORY') || '2gb';
    const evictionPolicy = this.config.get('REDIS_EVICTION_POLICY') || 'allkeys-lru';

    try {
      await this.redis.config('SET', 'maxmemory', maxMemory);
      await this.redis.config('SET', 'maxmemory-policy', evictionPolicy);
    } catch (error) {
      this.logger.error('Failed to configure Redis:', error);
    }
  }

  private parseRedisNodes() {
    const nodesConfig = this.config.get('REDIS_NODES');
    return nodesConfig.split(',').map(node => {
      const [host, port] = node.split(':');
      return { host, port: parseInt(port) };
    });
  }

  private setupRedisEventHandlers() {
    this.redis.on('error', error => {
      this.logger.error('Redis error:', error);
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.redis.on('ready', () => {
      this.logger.log('Redis is ready');
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.redis.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.set(key, serializedValue, 'PX', ttl);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
      throw error;
    }
  }

  async getMulti(keys: string[]): Promise<Array<any | null>> {
    try {
      const values = await this.redis.mget(keys);
      return values.map(value => (value ? JSON.parse(value) : null));
    } catch (error) {
      this.logger.error('Error getting multiple keys:', error);
      return keys.map(() => null);
    }
  }

  async setMulti(keyValues: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    const pipeline = this.redis.pipeline();

    try {
      keyValues.forEach(({ key, value, ttl }) => {
        const serializedValue = JSON.stringify(value);
        if (ttl) {
          pipeline.set(key, serializedValue, 'PX', ttl);
        } else {
          pipeline.set(key, serializedValue);
        }
      });

      await pipeline.exec();
    } catch (error) {
      this.logger.error('Error setting multiple keys:', error);
      throw error;
    }
  }

  async increment(key: string, value = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, value);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      throw error;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      return (await this.redis.expire(key, ttl)) === 1;
    } catch (error) {
      this.logger.error(`Error setting expiry for key ${key}:`, error);
      throw error;
    }
  }
}
