import { IPreloadConfig } from '../skeleton/skeleton.types';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { mergeMap, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PreloadService {
  private readonly config: IPreloadConfig = {
    strategy: 'progressive',
    priority: {
      critical: ['/api/config', '/api/user'],
      high: ['/api/content/featured'],
      medium: ['/api/content/list'],
      low: ['/api/recommendations'],
    },
    cache: {
      enabled: true,
      maxAge: 3600,
      maxSize: 50,
      strategy: 'LRU',
    },
    network: {
      timeout: 5000,
      retries: 3,
      concurrency: 4,
      throttle: 1000,
    },
  };

  private cache: Map<string, any> = new Map();
  private loading: Map<string, Promise<any>> = new Map();

  constructor(private platform: Platform) {}

  // 预加载资源
  preload(resources: string[]): Observable<any> {
    return from(resources).pipe(
      mergeMap(resource => this.loadResource(resource), this.config.network.concurrency),
    );
  }

  // 预加载关键资源
  preloadCritical(): Promise<void> {
    return this.preloadByPriority('critical');
  }

  // 预加载高优先级资源
  preloadHigh(): Promise<void> {
    return this.preloadByPriority('high');
  }

  // 获取资源
  async getResource(url: string): Promise<any> {
    // 检查缓存
    if (this.cache.has(url)) {
      const cached = this.cache.get(url);
      if (!this.isCacheExpired(cached)) {
        return cached.data;
      }
      this.cache.delete(url);
    }

    // 检查是否正在加载
    if (this.loading.has(url)) {
      return this.loading.get(url);
    }

    // 加载资源
    const loadPromise = this.loadResource(url).toPromise();
    this.loading.set(url, loadPromise);

    try {
      const data = await loadPromise;
      this.loading.delete(url);
      return data;
    } catch (error) {
      this.loading.delete(url);
      throw error;
    }
  }

  // 清除缓存
  clearCache(): void {
    this.cache.clear();
  }

  // 私有方法
  private loadResource(url: string): Observable<any> {
    return new Observable(observer => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (this.config.cache.enabled) {
            this.cacheResource(url, data);
          }
          observer.next(data);
          observer.complete();
        })
        .catch(error => observer.error(error));
    }).pipe(timeout(this.config.network.timeout), retry(this.config.network.retries));
  }

  private async preloadByPriority(priority: keyof IPreloadConfig['priority']): Promise<void> {
    const resources = this.config.priority[priority];
    await this.preload(resources).toPromise();
  }

  private cacheResource(url: string, data: any): void {
    if (this.cache.size >= this.config.cache.maxSize) {
      this.evictCache();
    }

    this.cache.set(url, {
      data,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  private isCacheExpired(cached: any): boolean {
    const age = Date.now() - cached.timestamp;
    return age > this.config.cache.maxAge * 1000;
  }

  private evictCache(): void {
    switch (this.config.cache.strategy) {
      case 'LRU':
        this.evictLRU();
        break;
      case 'LFU':
        this.evictLFU();
        break;
      case 'FIFO':
        this.evictFIFO();
        break;
    }
  }

  private evictLRU(): void {
    let oldest = Infinity;
    let oldestKey = '';

    this.cache.forEach((value, key) => {
      if (value.timestamp < oldest) {
        oldest = value.timestamp;
        oldestKey = key;
      }
    });

    this.cache.delete(oldestKey);
  }

  private evictLFU(): void {
    let leastFrequent = Infinity;
    let lfuKey = '';

    this.cache.forEach((value, key) => {
      if (value.hits < leastFrequent) {
        leastFrequent = value.hits;
        lfuKey = key;
      }
    });

    this.cache.delete(lfuKey);
  }

  private evictFIFO(): void {
    const firstKey = this.cache.keys().next().value;
    this.cache.delete(firstKey);
  }
}
