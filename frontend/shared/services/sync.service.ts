import { ApiService } from './api.service';
import { EventEmitter } from 'events';
import { storage } from '../utils';

export class SyncService {
  private api: ApiService;
  private ws: WebSocket | null = null;
  private eventEmitter: EventEmitter;
  private syncQueue: Map<string, any>;
  private retryAttempts: Map<string, number>;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.api = ApiService.getInstance();
    this.eventEmitter = new EventEmitter();
    this.syncQueue = new Map();
    this.retryAttempts = new Map();

    this.initializeWebSocket();
    this.setupNetworkListeners();
  }

  /**
   * 初始化WebSocket连接
   */
  private initializeWebSocket() {
    const wsUrl = `${process.env.WS_URL}/sync`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      this.handleSyncMessage(data);
    };

    this.ws.onclose = () => {
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  /**
   * 设置网络状态监听
   */
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * 同步数据
   */
  async syncData(data: { type: string; operation: 'create' | 'update' | 'delete'; data: any }) {
    const syncId = `${Date.now()}-${Math.random()}`;

    // 添加到同步队列
    this.syncQueue.set(syncId, {
      ...data,
      version: await this.getLocalVersion(data.type),
    });

    // 如果在线则立即处理
    if (this.isOnline) {
      await this.processSyncQueue();
    }

    return syncId;
  }

  /**
   * 处理同步队列
   */
  private async processSyncQueue() {
    for (const [syncId, data] of this.syncQueue.entries()) {
      try {
        const response = await this.api.post('/sync', data);

        if (response.conflictResolved) {
          // 处理冲突解决
          await this.handleConflictResolution(data.type, response.resolvedData);
        }

        // 更新本地版本
        await this.updateLocalVersion(data.type, response.version);

        // 移除已同步的数据
        this.syncQueue.delete(syncId);
        this.retryAttempts.delete(syncId);

        // 触发同步成功事件
        this.eventEmitter.emit('syncSuccess', { syncId, data });
      } catch (error) {
        // 处理重试逻辑
        const attempts = (this.retryAttempts.get(syncId) || 0) + 1;
        if (attempts <= 3) {
          this.retryAttempts.set(syncId, attempts);
          setTimeout(() => this.processSyncQueue(), 1000 * Math.pow(2, attempts));
        } else {
          // 同步失败，存储到本地
          await this.storeFailedSync(syncId, data);
          this.syncQueue.delete(syncId);
          this.retryAttempts.delete(syncId);
          this.eventEmitter.emit('syncError', { syncId, error });
        }
      }
    }
  }

  /**
   * 获取本地版本
   */
  private async getLocalVersion(dataType: string): Promise<number> {
    const version = await storage.get(`version:${dataType}`);
    return version ? parseInt(version) : 0;
  }

  /**
   * 更新本地版本
   */
  private async updateLocalVersion(dataType: string, version: number) {
    await storage.set(`version:${dataType}`, version.toString());
  }

  /**
   * 存储失败的同步
   */
  private async storeFailedSync(syncId: string, data: any) {
    const failedSyncs = (await storage.get('failedSyncs')) || {};
    failedSyncs[syncId] = {
      ...data,
      timestamp: Date.now(),
    };
    await storage.set('failedSyncs', failedSyncs);
  }

  /**
   * 处理同步消息
   */
  private async handleSyncMessage(message: any) {
    switch (message.type) {
      case 'sync_update':
        await this.handleRemoteUpdate(message);
        break;
      case 'conflict_notification':
        await this.handleConflictNotification(message);
        break;
    }
  }
}
