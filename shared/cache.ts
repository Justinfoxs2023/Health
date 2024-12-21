/**
 * @fileoverview TS 文件 cache.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 增加缓存机制
export class AnalysisCache {
  private cache: Map<string, any>;
  private maxSize: number;
  private ttl: number; // 缓存过期时间(ms)

  constructor(maxSize = 100, ttl = 3600000) {
    // 默认1小时过期
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key: string, value: any) {
    // 检查缓存大小
    if (this.cache.size >= this.maxSize) {
      // 删除最早的缓存
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }

  // 删除过期缓存
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
