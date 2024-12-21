import { openDB, IDBPDatabase } from 'idb';

interface IOfflineConfig {
  /** enableCache 的描述 */
  enableCache: boolean;
  /** enableSync 的描述 */
  enableSync: boolean;
  /** syncInterval 的描述 */
  syncInterval: number;
}

export class OfflineManager {
  private static db: IDBPDatabase;
  private static syncQueue: Array<{
    action: string;
    data: any;
    timestamp: number;
  }> = [];

  // 初始化离线功能
  static async init(config: IOfflineConfig) {
    if (config.enableCache) {
      await this.initDatabase();
    }

    if (config.enableSync) {
      this.startBackgroundSync(config.syncInterval);
    }

    // 监听在线状态
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  // 初始化数据库
  private static async initDatabase() {
    this.db = await openDB('healthApp', 1, {
      upgrade(db) {
        // 健康数据存储
        db.createObjectStore('healthData', { keyPath: 'id' });
        // 用户数据存储
        db.createObjectStore('userData', { keyPath: 'id' });
        // 同步队列存储
        db.createObjectStore('syncQueue', { keyPath: 'timestamp' });
      },
    });
  }

  // 缓存数据
  static async cacheData(storeName: string, data: any) {
    if (!this.db) return;

    try {
      await this.db.put(storeName, {
        ...data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error in OfflineManager.ts:', '数据缓存失败:', error);
    }
  }

  // 获取缓存数据
  static async getCachedData(storeName: string, id: string) {
    if (!this.db) return null;

    try {
      return await this.db.get(storeName, id);
    } catch (error) {
      console.error('Error in OfflineManager.ts:', '获取缓存数据失败:', error);
      return null;
    }
  }

  // 后台同步
  private static startBackgroundSync(interval: number) {
    setInterval(async () => {
      if (navigator.onLine && this.syncQueue.length > 0) {
        await this.processSyncQueue();
      }
    }, interval);
  }

  // 处理同步队列
  private static async processSyncQueue() {
    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of queue) {
      try {
        await this.syncItem(item);
      } catch (error) {
        console.error('Error in OfflineManager.ts:', '同步失败:', error);
        this.syncQueue.push(item);
      }
    }
  }
}
