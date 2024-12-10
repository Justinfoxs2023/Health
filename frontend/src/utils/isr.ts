import { ssrConfig } from '../config/ssr.config';
import { logger } from '@/services/logger';

interface ISRCache {
  data: any;
  lastRevalidated: number;
}

class ISRManager {
  private static cache = new Map<string, ISRCache>();
  private static revalidating = new Set<string>();

  /**
   * 获取页面数据，如果需要则重新生成
   */
  static async getData(path: string, generateFunc: () => Promise<any>) {
    const cached = this.cache.get(path);
    const now = Date.now();

    // 检查是否需要重新生成
    if (!cached || now - cached.lastRevalidated > ssrConfig.isr.revalidateInterval * 1000) {
      // 如果没有正在重新生成，则开始重新生成
      if (!this.revalidating.has(path)) {
        this.revalidateData(path, generateFunc);
      }
    }

    // 返回缓存数据或等待新数据
    return cached ? cached.data : await this.generateInitialData(path, generateFunc);
  }

  /**
   * 生成初始数据
   */
  private static async generateInitialData(path: string, generateFunc: () => Promise<any>) {
    try {
      const data = await generateFunc();
      this.cache.set(path, {
        data,
        lastRevalidated: Date.now()
      });
      return data;
    } catch (error) {
      logger.error('ISR初始数据生成失败:', { path, error });
      throw error;
    }
  }

  /**
   * 重新生成数据
   */
  private static async revalidateData(path: string, generateFunc: () => Promise<any>) {
    if (this.revalidating.size >= ssrConfig.isr.concurrentRevalidates) {
      return;
    }

    this.revalidating.add(path);
    let retries = 0;

    while (retries < ssrConfig.isr.maxRetries) {
      try {
        const newData = await generateFunc();
        this.cache.set(path, {
          data: newData,
          lastRevalidated: Date.now()
        });
        break;
      } catch (error) {
        retries++;
        logger.error('ISR数据重新生成失败:', { path, error, retry: retries });
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }

    this.revalidating.delete(path);
  }

  /**
   * 清除缓存
   */
  static clearCache(path?: string) {
    if (path) {
      this.cache.delete(path);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 获取缓存状态
   */
  static getCacheStatus() {
    return {
      size: this.cache.size,
      revalidating: Array.from(this.revalidating),
      paths: Array.from(this.cache.keys()).map(path => ({
        path,
        lastRevalidated: this.cache.get(path)?.lastRevalidated
      }))
    };
  }
} 