import Redis from 'ioredis';
import { ConfigLoader } from '../../config/config.loader';
import { RedisClient } from './redis-client.interface';
import { injectable } from 'inversify';

@injectable()
export class RedisClientImpl implements RedisClient {
  private client: Redis;
  private config = ConfigLoader.getInstance();

  constructor() {
    this.client = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.getNumber('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD'),
      db: this.config.getNumber('REDIS_DB', 0),
    });

    console.error('Error in redis.impl.ts:', 'error', error => {
      console.error('Error in redis.impl.ts:', 'Redis Client Error:', error);
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.client.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const subscriber = this.client.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on('message', (_channel, message) => {
      callback(message);
    });
  }
}
