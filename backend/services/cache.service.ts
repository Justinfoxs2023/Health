import { RedisClient, createClient } from 'redis';
import { promisify } from 'util';
import { Logger } from '../utils/logger';
import { EventEmitter } from 'events';

interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  prefix?: string;
  ttl?: number;
}

export class CacheService extends EventEmitter {
  private client: RedisClient;
  private logger: Logger;
  private defaultTTL: number;
  private prefix: string;

  // Promisified Redis commands
  private getAsync: (key: string) => Promise<string | null>;
  private setAsync: (key: string, value: string) => Promise<'OK'>;
  private delAsync: (key: string) => Promise<number>;

  constructor(config: CacheConfig) {
    super();
    this.logger = new Logger('CacheService');
    this.defaultTTL = config.ttl || 3600; // 默认1小时
    this.prefix = config.prefix || 'app:';

    this.client = createClient({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0,
      prefix: this.prefix
    });

    this.initializeClient();
    this.promisifyCommands();
  }

  // 初始化Redis客户端
  private initializeClient(): void {
    this.client.on('connect', () => {
      this.emit('connected');
      this.logger.info('Redis连接成功');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis错误:', error);
      this.emit('error', error);
    });
  }

  // Promise化Redis命令
  private promisifyCommands(): void {
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  // 设置缓存
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.setAsync(key, serializedValue);
      
      if (ttl || this.defaultTTL) {
        this.client.expire(key, ttl || this.defaultTTL);
      }
    } catch (error) {
      this.logger.error('设置缓存失败:', error);
      throw error;
    }
  }

  // 获取缓存
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.getAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('获取缓存失败:', error);
      throw error;
    }
  }

  // 删除缓存
  async delete(key: string): Promise<void> {
    try {
      await this.delAsync(key);
    } catch (error) {
      this.logger.error('删除缓存失败:', error);
      throw error;
    }
  }

  // 批量操作
  async mset(items: Record<string, any>, ttl?: number): Promise<void> {
    const multi = this.client.multi();
    
    Object.entries(items).forEach(([key, value]) => {
      multi.set(key, JSON.stringify(value));
      if (ttl || this.defaultTTL) {
        multi.expire(key, ttl || this.defaultTTL);
      }
    });

    await promisify(multi.exec).bind(multi)();
  }

  // 缓存预热
  async warmup(keys: string[]): Promise<void> {
    // 实现缓存预热逻辑
  }

  // 清理过期缓存
  async cleanup(): Promise<void> {
    // 实现缓存清理逻辑
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.set('health-check', 1, 10);
      return true;
    } catch (error) {
      return false;
    }
  }

  // 关闭连接
  async close(): Promise<void> {
    await promisify(this.client.quit).bind(this.client)();
    this.emit('disconnected');
    this.logger.info('Redis连接已关闭');
  }
} 