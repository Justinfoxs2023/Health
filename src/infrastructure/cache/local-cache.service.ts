import LRUCache from 'lru-cache';
import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalCacheService {
  private cache: LRUCache<string, any>;

  constructor(private readonly config: ConfigService) {
    this.initializeCache();
  }

  private initializeCache() {
    this.cache = new LRUCache({
      max: parseInt(this.config.get('CACHE_LOCAL_MAX_SIZE') || '10000'),
      maxAge: parseInt(this.config.get('CACHE_LOCAL_TTL') || '600000'), // 10 minutes
      updateAgeOnGet: true,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    this.cache.del(key);
  }

  async clear(): Promise<void> {
    this.cache.reset();
  }
}
