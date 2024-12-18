import Redis from 'ioredis';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Logger } from '../utils/logger';
import { MetricsService } from './metrics.service';
import { MongoClient, Db, Collection } from 'mongodb';
import { databaseConfig } from '../../config/database';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private mongoClient: MongoClient;
  private db: Db;
  private redis: Redis;
  private collections: Map<string, Collection> = new Map();
  private queryCache: Map<string, any> = new Map();
  private readonly logger = new Logger('DatabaseService');

  constructor(private readonly metricsService: MetricsService) {}

  async onModuleInit() {
    await this.connectMongo();
    await this.connectRedis();
    this.setupMonitoring();
  }

  async onModuleDestroy() {
    await this.closeConnections();
  }

  private async connectMongo() {
    try {
      this.mongoClient = await MongoClient.connect(
        databaseConfig.mongodb.uri,
        databaseConfig.mongodb.options,
      );
      this.db = this.mongoClient.db(databaseConfig.mongodb.dbName);
      this.logger.info('MongoDB connected successfully');
    } catch (error) {
      this.logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  private async connectRedis() {
    try {
      if (databaseConfig.redis.cluster.enabled) {
        this.redis = new Redis.Cluster(databaseConfig.redis.cluster.nodes, {
          redisOptions: databaseConfig.redis.options,
        });
      } else {
        this.redis = new Redis({
          host: databaseConfig.redis.host,
          port: databaseConfig.redis.port,
          password: databaseConfig.redis.password,
          db: databaseConfig.redis.db,
          ...databaseConfig.redis.options,
        });
      }
      this.logger.info('Redis connected successfully');
    } catch (error) {
      this.logger.error('Redis connection error:', error);
      throw error;
    }
  }

  private setupMonitoring() {
    // 监控数据库连接状态
    this.mongoClient.on('serverHeartbeatStarted', () => {
      this.metricsService.incrementCounter('mongodb_heartbeat_started');
    });

    this.mongoClient.on('serverHeartbeatSucceeded', () => {
      this.metricsService.incrementCounter('mongodb_heartbeat_succeeded');
    });

    this.mongoClient.on('serverHeartbeatFailed', error => {
      this.metricsService.incrementCounter('mongodb_heartbeat_failed');
      this.logger.error('MongoDB heartbeat failed:', error);
    });

    // 监控Redis连接状态
    this.redis.on('connect', () => {
      this.metricsService.incrementCounter('redis_connection_established');
    });

    this.redis.on('error', error => {
      this.metricsService.incrementCounter('redis_connection_error');
      this.logger.error('Redis error:', error);
    });
  }

  private async closeConnections() {
    try {
      await this.mongoClient?.close();
      await this.redis?.quit();
      this.logger.info('Database connections closed successfully');
    } catch (error) {
      this.logger.error('Error closing database connections:', error);
    }
  }

  // 获取集合，支持缓存
  getCollection(name: string): Collection {
    if (!this.collections.has(name)) {
      this.collections.set(name, this.db.collection(name));
    }
    return this.collections.get(name);
  }

  // 查询缓存管理
  async getCachedQuery(key: string, query: () => Promise<any>, ttl = 3600): Promise<any> {
    const cacheKey = `query:${key}`;

    try {
      // 尝试从Redis获取缓存
      const cachedResult = await this.redis.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // 执行查询
      const result = await query();

      // 存储到Redis
      await this.redis.setex(cacheKey, ttl, JSON.stringify(result));

      return result;
    } catch (error) {
      this.logger.error('Cache query error:', error);
      // 如果Redis出错，使用内存缓存作为后备
      if (this.queryCache.has(key)) {
        return this.queryCache.get(key);
      }
      const result = await query();
      this.queryCache.set(key, result);
      return result;
    }
  }

  // 清除缓存
  async invalidateCache(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`query:${pattern}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      // 清除内存缓存
      this.queryCache.clear();
    } catch (error) {
      this.logger.error('Cache invalidation error:', error);
    }
  }

  // 事务管理
  async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {
    const session = this.mongoClient.startSession();
    try {
      session.startTransaction();
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.db.command({ ping: 1 });
      await this.redis.ping();
      return true;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }
}
