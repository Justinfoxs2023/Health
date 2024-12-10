import Redis from 'ioredis';
import { createHash } from 'crypto';
import { logger } from '../logger';

interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number; // 缓存过期时间（秒）
  maxSize: number; // 最大缓存大小（字节）
}

class ImageCacheService {
  private redis: Redis;
  private config: CacheConfig;
  private currentSize: number = 0;

  constructor(config: CacheConfig) {
    this.config = config;
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
    });

    // 初始化缓存大小
    this.updateCacheSize();
  }

  /** 生成缓存键 */
  private generateKey(url: string, width?: number, height?: number): string {
    const hash = createHash('md5')
      .update(`${url}_${width || ''}_${height || ''}`)
      .digest('hex');
    return `image:${hash}`;
  }

  /** 更新缓存大小 */
  private async updateCacheSize(): Promise<void> {
    try {
      const keys = await this.redis.keys('image:*');
      let totalSize = 0;

      for (const key of keys) {
        const size = await this.redis.memory('usage', key);
        totalSize += size;
      }

      this.currentSize = totalSize;
      logger.info('当前缓存大小:', { size: this.formatSize(totalSize) });
    } catch (error) {
      logger.error('更新缓存大小失败:', error);
    }
  }

  /** 格式化大小 */
  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /** 缓存图片 */
  async set(url: string, buffer: Buffer, width?: number, height?: number): Promise<void> {
    try {
      const key = this.generateKey(url, width, height);
      const size = buffer.length;

      // 检查缓存大小
      if (this.currentSize + size > this.config.maxSize) {
        await this.cleanup();
      }

      // 设置缓存
      await this.redis.set(key, buffer, 'EX', this.config.ttl);
      this.currentSize += size;

      // 记录图片信息
      await this.redis.hset(`${key}:info`, {
        url,
        size,
        width: width || 0,
        height: height || 0,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 0,
      });

      logger.info('图片��缓存:', { url, size: this.formatSize(size) });
    } catch (error) {
      logger.error('缓存图片失败:', error);
      throw error;
    }
  }

  /** 获取缓存图片 */
  async get(url: string, width?: number, height?: number): Promise<Buffer | null> {
    try {
      const key = this.generateKey(url, width, height);
      const buffer = await this.redis.getBuffer(key);

      if (buffer) {
        // 更新访问信息
        await this.redis.hincrby(`${key}:info`, 'accessCount', 1);
        await this.redis.hset(`${key}:info`, 'lastAccessed', Date.now());
        
        logger.info('命中缓存:', { url });
        return buffer;
      }

      return null;
    } catch (error) {
      logger.error('获取缓存图片失败:', error);
      return null;
    }
  }

  /** 清理缓存 */
  async cleanup(): Promise<void> {
    try {
      // 获取所有图片信息
      const keys = await this.redis.keys('image:*:info');
      const images = [];

      for (const key of keys) {
        const info = await this.redis.hgetall(key);
        images.push({
          key: key.replace(':info', ''),
          ...info,
          lastAccessed: Number(info.lastAccessed),
          accessCount: Number(info.accessCount),
        });
      }

      // 按最后访问时间排序
      images.sort((a, b) => a.lastAccessed - b.lastAccessed);

      // 删除旧的缓存直到空间足够
      let freedSpace = 0;
      for (const image of images) {
        if (this.currentSize - freedSpace <= this.config.maxSize * 0.8) {
          break;
        }

        await this.redis.del(image.key);
        await this.redis.del(`${image.key}:info`);
        freedSpace += Number(image.size);

        logger.info('清理缓存:', {
          url: image.url,
          size: this.formatSize(Number(image.size)),
        });
      }

      this.currentSize -= freedSpace;
      logger.info('缓存清理完成:', {
        freedSpace: this.formatSize(freedSpace),
        currentSize: this.formatSize(this.currentSize),
      });
    } catch (error) {
      logger.error('清理缓存失败:', error);
      throw error;
    }
  }

  /** 获取缓存统计信息 */
  async getStats(): Promise<{
    size: number;
    itemCount: number;
    hitRate: number;
  }> {
    try {
      const keys = await this.redis.keys('image:*:info');
      let totalHits = 0;
      let totalItems = keys.length;

      for (const key of keys) {
        const info = await this.redis.hgetall(key);
        totalHits += Number(info.accessCount);
      }

      return {
        size: this.currentSize,
        itemCount: totalItems,
        hitRate: totalItems > 0 ? totalHits / totalItems : 0,
      };
    } catch (error) {
      logger.error('获取缓存统计失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
export const imageCache = new ImageCacheService({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  ttl: 24 * 60 * 60, // 1天
  maxSize: 1024 * 1024 * 1024, // 1GB
}); 