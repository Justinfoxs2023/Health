import { openDB, IDBPDatabase } from 'idb';
import { BehaviorSubject } from 'rxjs';

interface SyncConfig {
  dbName: string;
  version: number;
  stores: string[];
  syncInterval?: number;
}

interface SyncStatus {
  lastSync: Date | null;
  isSyncing: boolean;
  error: Error | null;
  pendingChanges: number;
}

export class SyncService {
  private db: IDBPDatabase;
  private config: SyncConfig;
  private syncStatus$ = new BehaviorSubject<SyncStatus>({
    lastSync: null,
    isSyncing: false,
    error: null,
    pendingChanges: 0
  });

  constructor(config: SyncConfig) {
    this.config = {
      syncInterval: 5 * 60 * 1000, // 默认5分钟同步一次
      ...config
    };
    this.initDB();
    this.startAutoSync();
  }

  // 初始化IndexedDB
  private async initDB() {
    try {
      this.db = await openDB(this.config.dbName, this.config.version, {
        upgrade(db) {
          // 创建存储对象
          for (const store of this.config.stores) {
            if (!db.objectStoreNames.contains(store)) {
              db.createObjectStore(store, { keyPath: '_id' });
              // 创建索引
              const objectStore = db.createObjectStore(store, { keyPath: '_id' });
              objectStore.createIndex('updatedAt', 'updatedAt');
              objectStore.createIndex('syncStatus', 'syncStatus');
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      this.updateSyncStatus({ error });
    }
  }

  // 开始自动同步
  private startAutoSync() {
    setInterval(() => {
      this.sync();
    }, this.config.syncInterval);
  }

  // 更新同步状态
  private updateSyncStatus(partial: Partial<SyncStatus>) {
    const current = this.syncStatus$.value;
    this.syncStatus$.next({
      ...current,
      ...partial
    });
  }

  // 获取同步状态
  getSyncStatus() {
    return this.syncStatus$.asObservable();
  }

  // 同步数据
  async sync() {
    if (this.syncStatus$.value.isSyncing) {
      return;
    }

    try {
      this.updateSyncStatus({ isSyncing: true, error: null });

      // 获取所有待同步的数据
      const pendingChanges = await this.getPendingChanges();
      
      if (pendingChanges.length > 0) {
        // 上传本地更改到服务器
        await this.uploadChanges(pendingChanges);
      }

      // 从服务器获取最新数据
      await this.fetchServerChanges();

      this.updateSyncStatus({
        lastSync: new Date(),
        isSyncing: false,
        pendingChanges: 0
      });
    } catch (error) {
      console.error('Sync failed:', error);
      this.updateSyncStatus({
        isSyncing: false,
        error
      });
    }
  }

  // 获取待同步的数据
  private async getPendingChanges() {
    const changes = [];
    for (const store of this.config.stores) {
      const tx = this.db.transaction(store, 'readonly');
      const index = tx.store.index('syncStatus');
      const pending = await index.getAll('pending');
      changes.push(...pending.map(item => ({ store, item })));
    }
    return changes;
  }

  // 上传更改到服务器
  private async uploadChanges(changes: any[]) {
    // TODO: 实现批量上传逻辑
  }

  // 获取服务器更改
  private async fetchServerChanges() {
    // TODO: 实现增量同步逻辑
  }

  // 保存数据到本地
  async saveLocal(store: string, data: any) {
    try {
      const tx = this.db.transaction(store, 'readwrite');
      await tx.store.put({
        ...data,
        syncStatus: 'pending',
        updatedAt: new Date()
      });
      this.updateSyncStatus({
        pendingChanges: this.syncStatus$.value.pendingChanges + 1
      });
    } catch (error) {
      console.error(`Failed to save to ${store}:`, error);
      throw error;
    }
  }

  // 从本地获取数据
  async getLocal(store: string, id: string) {
    try {
      return await this.db.get(store, id);
    } catch (error) {
      console.error(`Failed to get from ${store}:`, error);
      throw error;
    }
  }

  // 从本地删除数据
  async deleteLocal(store: string, id: string) {
    try {
      await this.db.delete(store, id);
    } catch (error) {
      console.error(`Failed to delete from ${store}:`, error);
      throw error;
    }
  }

  // 清除本地数据
  async clearLocal(store: string) {
    try {
      await this.db.clear(store);
    } catch (error) {
      console.error(`Failed to clear ${store}:`, error);
      throw error;
    }
  }

  // 获取本地数据列表
  async getLocalList(store: string, query: any = {}) {
    try {
      const tx = this.db.transaction(store, 'readonly');
      const index = tx.store.index('updatedAt');
      return await index.getAll();
    } catch (error) {
      console.error(`Failed to get list from ${store}:`, error);
      throw error;
    }
  }

  // 处理冲突
  private async resolveConflict(local: any, server: any) {
    // 默认使用服务器版本
    return server;
  }

  // 检查网络状态
  private isOnline() {
    return navigator.onLine;
  }

  // 添加网络状态监听
  private addNetworkListeners() {
    window.addEventListener('online', () => {
      this.sync();
    });

    window.addEventListener('offline', () => {
      this.updateSyncStatus({
        error: new Error('Network is offline')
      });
    });
  }
} 