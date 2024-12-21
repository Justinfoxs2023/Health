import Redis from 'ioredis';
import { IRedisClient, IRedisMulti } from './index';
import { config } from '../../config';
import { injectable } from 'inversify';

@injectable()
export class RedisClientImpl implements IRedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.client.setex(key, seconds, value);
  }

  async del(key: string | string[]): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  multi(): IRedisMulti {
    return this.client.multi() as IRedisMulti;
  }
}
