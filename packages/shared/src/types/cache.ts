export interface CacheOptions {
  /** 缓存过期时间（毫秒） */
  ttl?: number;
  /** 缓存键前缀 */
  prefix?: string;
  /** 是否启用压缩 */
  compression?: boolean;
  /** 最大缓存条目数 */
  maxEntries?: number;
  /** 最大缓存大小（字节） */
  maxSize?: number;
}

export interface CacheEntry<T> {
  /** 缓存数据 */
  data: T;
  /** 过期时间戳 */
  expireAt?: number;
  /** 创建时间戳 */
  createdAt: number;
  /** 最后访问时间戳 */
  lastAccessed: number;
  /** 访问次数 */
  accessCount: number;
} 