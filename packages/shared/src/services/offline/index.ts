import { BehaviorSubject } from 'rxjs';
import { IndexedDBManager } from '../../utils/indexedDB';
import { SyncService } from '../sync';

interface IOfflineState {
  /** isOffline 的描述 */
  isOffline: boolean;
  /** isSyncing 的描述 */
  isSyncing: boolean;
  /** lastSyncTime 的描述 */
  lastSyncTime: Date | null;
  /** error 的描述 */
  error: Error | null;
  /** pendingChanges 的描述 */
  pendingChanges: number;
}

export class OfflineManager {
  private db: IndexedDBManager;
  private syncService: SyncService;
  private state$ = new BehaviorSubject<IOfflineState>({
    isOffline: !navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    error: null,
    pendingChanges: 0,
  });

  constructor(dbName: string, version: number, stores: string[], syncInterval?: number) {
    this.db = new IndexedDBManager(dbName, version, stores);
    this.syncService = new SyncService({
      dbName,
      version,
      stores,
      syncInterval,
    });

    this.initializeServices();
    this.setupEventListeners();
  }

  private async initializeServices() {
    try {
      await this.db.init();

      // 订阅同步状态
      this.syncService.getSyncStatus().subscribe(status => {
        this.updateState({
          isSyncing: status.isSyncing,
          lastSyncTime: status.lastSync,
          error: status.error,
          pendingChanges: status.pendingChanges,
        });
      });
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to initialize offline services:', error);
      this.updateState({ error });
    }
  }

  private setupEventListeners() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.updateState({ isOffline: false });
    this.syncService.sync();
  };

  private handleOffline = () => {
    this.updateState({ isOffline: true });
  };

  private updateState(partial: Partial<IOfflineState>) {
    this.state$.next({
      ...this.state$.value,
      ...partial,
    });
  }

  // 获取状态流
  getState() {
    return this.state$.asObservable();
  }

  // 保存数据
  async saveData(store: string, data: any) {
    try {
      await this.db.put(store, data);
      this.updateState({
        pendingChanges: this.state$.value.pendingChanges + 1,
      });

      if (navigator.onLine) {
        this.syncService.sync();
      }
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to save data:', error);
      throw error;
    }
  }

  // 批量保存数据
  async saveBulkData(store: string, items: any[]) {
    try {
      await this.db.putBulk(store, items);
      this.updateState({
        pendingChanges: this.state$.value.pendingChanges + items.length,
      });

      if (navigator.onLine) {
        this.syncService.sync();
      }
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to save bulk data:', error);
      throw error;
    }
  }

  // 获取数据
  async getData(store: string, id: string) {
    try {
      return await this.db.get(store, id);
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to get data:', error);
      throw error;
    }
  }

  // 删除数据
  async deleteData(store: string, id: string) {
    try {
      await this.db.delete(store, id);
      this.updateState({
        pendingChanges: this.state$.value.pendingChanges + 1,
      });

      if (navigator.onLine) {
        this.syncService.sync();
      }
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to delete data:', error);
      throw error;
    }
  }

  // 获取数据列表
  async getDataList(store: string, query?: any) {
    try {
      return await this.db.getRange(store, query);
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to get data list:', error);
      throw error;
    }
  }

  // 手动同步
  async sync() {
    if (this.state$.value.isOffline) {
      throw new Error('Cannot sync while offline');
    }

    try {
      await this.syncService.sync();
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to sync:', error);
      throw error;
    }
  }

  // 清除存储
  async clearStore(store: string) {
    try {
      await this.db.clear(store);
      this.updateState({
        pendingChanges: 0,
      });
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to clear store:', error);
      throw error;
    }
  }

  // 获取待同步的更改
  async getPendingChanges(store: string) {
    try {
      return await this.db.getPendingChanges(store);
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to get pending changes:', error);
      throw error;
    }
  }

  // 更新同步状态
  async updateSyncStatus(store: string, id: string, status: string) {
    try {
      await this.db.updateSyncStatus(store, id, status);
      if (status === 'synced') {
        this.updateState({
          pendingChanges: Math.max(0, this.state$.value.pendingChanges - 1),
        });
      }
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to update sync status:', error);
      throw error;
    }
  }

  // 批量更新同步状态
  async updateSyncStatusBulk(store: string, ids: string[], status: string) {
    try {
      await this.db.updateSyncStatusBulk(store, ids, status);
      if (status === 'synced') {
        this.updateState({
          pendingChanges: Math.max(0, this.state$.value.pendingChanges - ids.length),
        });
      }
    } catch (error) {
      console.error('Error in index.ts:', 'Failed to update bulk sync status:', error);
      throw error;
    }
  }

  // 销毁实例
  destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.db.close();
  }
}
