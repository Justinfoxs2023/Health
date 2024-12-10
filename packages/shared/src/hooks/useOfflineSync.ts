import { useState, useEffect, useCallback } from 'react';
import { SyncService } from '../services/sync';
import { IndexedDBManager } from '../utils/indexedDB';

interface UseOfflineSyncOptions {
  dbName: string;
  version: number;
  stores: string[];
  syncInterval?: number;
  onSyncStart?: () => void;
  onSyncComplete?: () => void;
  onSyncError?: (error: Error) => void;
  onOfflineChange?: (isOffline: boolean) => void;
}

interface SyncState {
  isOffline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: Error | null;
  pendingChanges: number;
}

export function useOfflineSync(options: UseOfflineSyncOptions) {
  const [state, setState] = useState<SyncState>({
    isOffline: !navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    error: null,
    pendingChanges: 0
  });

  const [db, setDb] = useState<IndexedDBManager | null>(null);
  const [syncService, setSyncService] = useState<SyncService | null>(null);

  // 初始化数据库和同步服务
  useEffect(() => {
    const initServices = async () => {
      try {
        // 初始化IndexedDB
        const dbManager = new IndexedDBManager(
          options.dbName,
          options.version,
          options.stores
        );
        await dbManager.init();
        setDb(dbManager);

        // 初始化同步服务
        const sync = new SyncService({
          dbName: options.dbName,
          version: options.version,
          stores: options.stores,
          syncInterval: options.syncInterval
        });
        setSyncService(sync);

        // 订阅同步状态
        const subscription = sync.getSyncStatus().subscribe(status => {
          setState(prev => ({
            ...prev,
            isSyncing: status.isSyncing,
            lastSyncTime: status.lastSync,
            error: status.error,
            pendingChanges: status.pendingChanges
          }));

          if (status.isSyncing) {
            options.onSyncStart?.();
          } else if (!status.error) {
            options.onSyncComplete?.();
          } else {
            options.onSyncError?.(status.error);
          }
        });

        return () => {
          subscription.unsubscribe();
          dbManager.close();
        };
      } catch (error) {
        console.error('Failed to initialize offline sync:', error);
        setState(prev => ({ ...prev, error }));
      }
    };

    initServices();
  }, [options.dbName, options.version, options.stores, options.syncInterval]);

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      options.onOfflineChange?.(false);
      syncService?.sync();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      options.onOfflineChange?.(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncService]);

  // 保存数据
  const saveData = useCallback(async (store: string, data: any) => {
    if (!db) throw new Error('Database not initialized');

    try {
      await db.put(store, data);
      setState(prev => ({
        ...prev,
        pendingChanges: prev.pendingChanges + 1
      }));

      if (navigator.onLine) {
        syncService?.sync();
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }, [db, syncService]);

  // 获取数据
  const getData = useCallback(async (store: string, id: string) => {
    if (!db) throw new Error('Database not initialized');

    try {
      return await db.get(store, id);
    } catch (error) {
      console.error('Failed to get data:', error);
      throw error;
    }
  }, [db]);

  // 删除数据
  const deleteData = useCallback(async (store: string, id: string) => {
    if (!db) throw new Error('Database not initialized');

    try {
      await db.delete(store, id);
      setState(prev => ({
        ...prev,
        pendingChanges: prev.pendingChanges + 1
      }));

      if (navigator.onLine) {
        syncService?.sync();
      }
    } catch (error) {
      console.error('Failed to delete data:', error);
      throw error;
    }
  }, [db, syncService]);

  // 获取数据列表
  const getDataList = useCallback(async (store: string, query?: any) => {
    if (!db) throw new Error('Database not initialized');

    try {
      return await db.getRange(store, query);
    } catch (error) {
      console.error('Failed to get data list:', error);
      throw error;
    }
  }, [db]);

  // 手动同步
  const sync = useCallback(async () => {
    if (!syncService) throw new Error('Sync service not initialized');

    try {
      await syncService.sync();
    } catch (error) {
      console.error('Failed to sync:', error);
      throw error;
    }
  }, [syncService]);

  // 清除本地数据
  const clearStore = useCallback(async (store: string) => {
    if (!db) throw new Error('Database not initialized');

    try {
      await db.clear(store);
      setState(prev => ({
        ...prev,
        pendingChanges: 0
      }));
    } catch (error) {
      console.error('Failed to clear store:', error);
      throw error;
    }
  }, [db]);

  return {
    state,
    saveData,
    getData,
    deleteData,
    getDataList,
    sync,
    clearStore
  };
} 