import { LocalDatabase } from '../utils/local-database';

interface SyncConfig {
  syncInterval: number; // 同步间隔(ms)
  retryAttempts: number; // 重试次数
  batchSize: number; // 批量同步大小
  priority: 'realtime' | 'batch' | 'manual';
}

interface SyncStatus {
  lastSync: Date;
  pendingChanges: number;
  syncErrors: Error[];
  isSyncing: boolean;
}

export class DataSyncMiddleware {
  private db: LocalDatabase;
  private config: SyncConfig;
  private status: SyncStatus;
  private syncQueue: Map<string, any[]>;
  private syncInterval: NodeJS.Timeout | null;

  constructor() {
    this.db = new LocalDatabase('sync-store');
    this.config = {
      syncInterval: 5000,
      retryAttempts: 3,
      batchSize: 100,
      priority: 'realtime'
    };
    this.status = {
      lastSync: new Date(),
      pendingChanges: 0,
      syncErrors: [],
      isSyncing: false
    };
    this.syncQueue = new Map();
    this.initializeSync();
  }

  // 初始化同步
  private async initializeSync(): Promise<void> {
    await this.loadSyncState();
    this.startSyncInterval();
    this.registerOfflineHandler();
  }

  // 添加数据到同步队列
  async queueChange(type: string, data: any): Promise<void> {
    if (!this.syncQueue.has(type)) {
      this.syncQueue.set(type, []);
    }
    this.syncQueue.get(type)!.push({
      data,
      timestamp: new Date(),
      retryCount: 0
    });
    this.status.pendingChanges++;

    if (this.config.priority === 'realtime') {
      await this.syncImmediately();
    }
  }

  // 立即同步
  private async syncImmediately(): Promise<void> {
    if (this.status.isSyncing) return;
    
    try {
      this.status.isSyncing = true;
      for (const [type, changes] of this.syncQueue.entries()) {
        const batch = changes.slice(0, this.config.batchSize);
        await this.syncBatch(type, batch);
        
        // 移除已同步的数据
        this.syncQueue.set(type, changes.slice(this.config.batchSize));
        this.status.pendingChanges -= batch.length;
      }
    } catch (error) {
      this.handleSyncError(error);
    } finally {
      this.status.isSyncing = false;
      this.status.lastSync = new Date();
      await this.saveSyncState();
    }
  }

  // 批量同步
  private async syncBatch(type: string, batch: any[]): Promise<void> {
    try {
      const response = await fetch(`/api/sync/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batch)
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      // 处理响应
      const result = await response.json();
      await this.handleSyncResponse(result);
    } catch (error) {
      await this.handleBatchError(type, batch, error);
    }
  }

  // 处理离线同步
  private async handleOfflineSync(): Promise<void> {
    const offlineChanges = await this.db.get('offline-changes') || [];
    if (offlineChanges.length > 0) {
      await this.queueChange('offline', offlineChanges);
      await this.db.delete('offline-changes');
    }
  }

  // 错误处理
  private async handleSyncError(error: Error): Promise<void> {
    this.status.syncErrors.push(error);
    if (this.status.syncErrors.length > 10) {
      this.status.syncErrors.shift();
    }
    
    // 存储错误日志
    await this.db.put('sync-errors', this.status.syncErrors);
    
    // 触发错误事件
    this.emit('syncError', error);
  }

  // 保存同步状态
  private async saveSyncState(): Promise<void> {
    await this.db.put('sync-status', {
      lastSync: this.status.lastSync,
      pendingChanges: this.status.pendingChanges,
      syncQueue: Array.from(this.syncQueue.entries())
    });
  }

  // 加载同步状态
  private async loadSyncState(): Promise<void> {
    const savedState = await this.db.get('sync-status');
    if (savedState) {
      this.status.lastSync = new Date(savedState.lastSync);
      this.status.pendingChanges = savedState.pendingChanges;
      this.syncQueue = new Map(savedState.syncQueue);
    }
  }

  // 启动同步定时器
  private startSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.syncInterval = setInterval(
      () => this.syncImmediately(),
      this.config.syncInterval
    );
  }

  // 注册离线处理
  private registerOfflineHandler(): void {
    window.addEventListener('online', () => {
      this.handleOfflineSync();
    });

    window.addEventListener('offline', () => {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
      }
    });
  }

  // 获取同步状态
  getSyncStatus(): SyncStatus {
    return { ...this.status };
  }

  // 事件发射器
  private emit(event: string, data: any): void {
    const customEvent = new CustomEvent(event, { detail: data });
    window.dispatchEvent(customEvent);
  }
} 