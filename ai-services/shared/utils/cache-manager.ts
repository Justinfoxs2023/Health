import { Injectable } from '@nestjs/common';
import { Logger } from './logger';

interface ICacheItem<T> {
  /** value 的描述 */
  value: T;
  /** expiry 的描述 */
  expiry: number;
}

@Injectable()
export class CacheManager {
  private readonly logger = new Logger(CacheManager.name);
  private readonly cache: Map<string, ICacheItem<any>> = new Map();

  constructor() {
    // 定期清理过期缓存
    setInterval(() => this.cleanExpiredCache(), 60000); // 每分钟清理一次
  }

  /**
   * 设置缓存
   */
  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const expiry = Date.now() + ttlSeconds * 1000;
      this.cache.set(key, { value, expiry });
      this.logger.debug(`缓存设置成功: ${key}`);
    } catch (error) {
      this.logger.error(`缓存设置失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.cache.get(key);

      if (!item) {
        return null;
      }

      if (item.expiry < Date.now()) {
        this.cache.delete(key);
        return null;
      }

      this.logger.debug(`缓存命中: ${key}`);
      return item.value as T;
    } catch (error) {
      this.logger.error(`缓存获取失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 删除缓存
   */
  async delete(key: string): Promise<void> {
    try {
      this.cache.delete(key);
      this.logger.debug(`缓存删除成功: ${key}`);
    } catch (error) {
      this.logger.error(`缓存删除失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 清空缓存
   */
  async clear(): Promise<void> {
    try {
      this.cache.clear();
      this.logger.info('缓存已清空');
    } catch (error) {
      this.logger.error('缓存清空失败', error);
      throw error;
    }
  }

  /**
   * 获取缓存统计信息
   */
  async getStats(): Promise<{
    size: number;
    activeItems: number;
    expiredItems: number;
  }> {
    try {
      const now = Date.now();
      let activeItems = 0;
      let expiredItems = 0;

      this.cache.forEach(item => {
        if (item.expiry >= now) {
          activeItems++;
        } else {
          expiredItems++;
        }
      });

      return {
        size: this.cache.size,
        activeItems,
        expiredItems,
      };
    } catch (error) {
      this.logger.error('获取缓存统计信息失败', error);
      throw error;
    }
  }

  /**
   * 清理过期缓存
   */
  private cleanExpiredCache(): void {
    try {
      const now = Date.now();
      let cleaned = 0;

      this.cache.forEach((item, key) => {
        if (item.expiry < now) {
          this.cache.delete(key);
          cleaned++;
        }
      });

      if (cleaned > 0) {
        this.logger.debug(`清理过期缓存: ${cleaned}项`);
      }
    } catch (error) {
      this.logger.error('清理过期缓存失败', error);
    }
  }
}
