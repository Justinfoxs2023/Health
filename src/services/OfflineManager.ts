import { openDB, IDBPDatabase } from 'idb';

import { NetworkStatus } from '@/utils/networkStatus';

interface ICacheConfig {
  /** storeName 的描述 */
    storeName: string;
  /** maxAge 的描述 */
    maxAge: number;
  /** priority 的描述 */
    priority: high  normal  low;
}

export class OfflineManager {
  private db: IDBPDatabase;
  private syncQueue: Array<{
    action: string;
    data: any;
    timestamp: number;
  }> = [];

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    this.db = await openDB('healthApp', 1, {
      upgrade(db) {
        // 健康记录存储
        db.createObjectStore('healthRecords', { keyPath: 'id' });
        // 文章缓存存储
        db.createObjectStore('articles', { keyPath: 'id' });
        // 多媒体资源缓存
        db.createObjectStore('media', { keyPath: 'url' });
        // 同步队列存储
        db.createObjectStore('syncQueue', { keyPath: 'timestamp' });
      },
    });
  }

  // 数据缓存
  async cacheData(config: ICacheConfig, data: any) {
    try {
      await this.db.put(config.storeName, {
        ...data,
        timestamp: Date.now(),
        maxAge: config.maxAge,
      });
    } catch (error) {
      console.error('Error in OfflineManager.ts:', '缓存数据失败:', error);
    }
  }

  // 离线数据收集
  async collectOfflineData(data: any) {
    try {
      this.syncQueue.push({
        action: 'collect',
        data,
        timestamp: Date.now(),
      });
      await this.db.put('syncQueue', this.syncQueue);
    } catch (error) {
      console.error('Error in OfflineManager.ts:', '离线数据收集失败:', error);
    }
  }

  // 数据同步
  async syncData() {
    if (!NetworkStatus.isOnline()) return;

    try {
      const queue = await this.db.getAll('syncQueue');
      for (const item of queue) {
        await this.processSyncItem(item);
      }
      await this.db.clear('syncQueue');
    } catch (error) {
      console.error('Error in OfflineManager.ts:', '数据同步失败:', error);
    }
  }

  // 冲突解决
  private async resolveConflict(localData: any, serverData: any) {
    // 基于时间戳的冲突解决
    return localData.timestamp > serverData.timestamp ? localData : serverData;
  }
}
