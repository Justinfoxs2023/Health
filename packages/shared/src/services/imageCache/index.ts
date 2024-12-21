import { BehaviorSubject } from 'rxjs';

interface ICacheStats {
  /** size 的描述 */
  size: number; // MB
  /** entries 的描述 */
  entries: number;
  /** hits 的描述 */
  hits: number;
  /** misses 的描述 */
  misses: number;
  /** hitRate 的描述 */
  hitRate: number;
}

interface ICacheEntry {
  /** blob 的描述 */
  blob: Blob;
  /** timestamp 的描述 */
  timestamp: number;
  /** size 的描述 */
  size: number;
}

export class ImageCacheService {
  private cache: Map<string, ICacheEntry>;
  private stats: ICacheStats;
  private maxSize: number; // MB
  private maxAge: number; // ms
  private state$: BehaviorSubject<ICacheStats>;

  constructor(maxSize = 100, maxAge = 24 * 60 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.stats = {
      size: 0,
      entries: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
    };
    this.state$ = new BehaviorSubject<ICacheStats>(this.stats);
  }

  public async set(key: string, blob: Blob): Promise<void> {
    const size = blob.size / (1024 * 1024); // Convert to MB

    // 检查缓存大小是否超出限制
    if (this.stats.size + size > this.maxSize) {
      await this.cleanup();
    }

    // 如果单个文件太大,直接返回
    if (size > this.maxSize) {
      console.warn(`Image too large to cache: ${size}MB`);
      return;
    }

    const entry: ICacheEntry = {
      blob,
      timestamp: Date.now(),
      size,
    };

    this.cache.set(key, entry);
    this.updateStats('set', size);
  }

  public async get(key: string): Promise<Blob | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.updateStats('miss');
      return null;
    }

    // 检查是否过期
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      this.updateStats('delete', entry.size);
      return null;
    }

    this.updateStats('hit');
    return entry.blob;
  }

  public async delete(key: string): Promise<void> {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.updateStats('delete', entry.size);
    }
  }

  public async clear(): Promise<void> {
    this.cache.clear();
    this.stats = {
      size: 0,
      entries: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
    };
    this.state$.next(this.stats);
  }

  public getStats(): ICacheStats {
    return { ...this.stats };
  }

  public getState() {
    return this.state$;
  }

  private async cleanup(): Promise<void> {
    // 按时间戳排序,删除最旧的条目
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp,
    );

    while (this.stats.size > this.maxSize * 0.8 && entries.length > 0) {
      const [key, entry] = entries.shift()!;
      this.cache.delete(key);
      this.updateStats('delete', entry.size);
    }
  }

  private updateStats(operation: 'set' | 'delete' | 'hit' | 'miss', size = 0) {
    switch (operation) {
      case 'set':
        this.stats.size += size;
        this.stats.entries++;
        break;
      case 'delete':
        this.stats.size -= size;
        this.stats.entries--;
        break;
      case 'hit':
        this.stats.hits++;
        break;
      case 'miss':
        this.stats.misses++;
        break;
    }

    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;

    this.state$.next({ ...this.stats });
  }
}
