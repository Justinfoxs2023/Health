import { Logger } from '../utils/logger';
import { createClient, RedisClientType } from 'redis';

const logger = new Logger('Redis');

export class RedisConfig {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
      database: parseInt(process.env.REDIS_DB || '0')
    });

// 修复: 添加 connectRedis 导出
export const connectRedis = async () => {
  try {
    await redis.connect();
    console.log('Redis连接成功');
    return redis;
  } catch (error) {
    console.error('Error in redis.config.ts:', 'Redis连接失败:', error);
    throw error;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.client.setEx(key, seconds, value);
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
} 