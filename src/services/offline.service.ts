import { Injectable } from '@nestjs/common';
import { IndexedDB } from '../utils/indexeddb';
import { LocalStorage } from '../utils/localStorage';
import { SyncService } from './sync.service';
import { NetworkService } from './network.service';
import { HealthMetrics, Activity, Nutrition, Sleep, MentalHealth } from '../models/health.model';

@Injectable()
export class OfflineService {
  private db: IndexedDB;
  private storage: LocalStorage;
  private syncQueue: Array<{
    model: string;
    operation: string;
    data: any;
    timestamp: number;
  }> = [];

  constructor(
    private readonly syncService: SyncService,
    private readonly networkService: NetworkService,
  ) {
    this.initializeStorage();
    this.startSyncMonitoring();
  }

  private async initializeStorage() {
    // 初始化 IndexedDB
    this.db = new IndexedDB('healthApp', 1);
    await this.db.createStores([
      'healthMetrics',
      'activities',
      'nutrition',
      'sleep',
      'mentalHealth',
      'syncQueue'
    ]);

    // 初始化 LocalStorage
    this.storage = new LocalStorage();
    
    // 恢复同步队列
    const savedQueue = await this.db.getAll('syncQueue');
    this.syncQueue = savedQueue || [];
  }

  private startSyncMonitoring() {
    // 监听网络状态
    this.networkService.onNetworkStatusChange(async (isOnline) => {
      if (isOnline) {
        await this.synchronizeData();
      }
    });

    // 定期检查同步
    setInterval(async () => {
      if (this.networkService.isOnline()) {
        await this.synchronizeData();
      }
    }, 5 * 60 * 1000); // 每5分钟检查一次
  }

  // 保存健康数据到本地
  async saveHealthData(model: string, data: any) {
    try {
      // 保存到 IndexedDB
      await this.db.add(model.toLowerCase(), data);

      // 添加到同步队列
      const syncItem = {
        model,
        operation: 'create',
        data,
        timestamp: Date.now()
      };
      this.syncQueue.push(syncItem);
      await this.db.add('syncQueue', syncItem);

      // 如果在线，尝试立即同步
      if (this.networkService.isOnline()) {
        await this.synchronizeData();
      }

      return true;
    } catch (error) {
      console.error('Error saving offline data:', error);
      return false;
    }
  }

  // 获取本地健康数据
  async getHealthData(model: string, query: any = {}) {
    try {
      return await this.db.getAll(model.toLowerCase(), query);
    } catch (error) {
      console.error('Error getting offline data:', error);
      return [];
    }
  }

  // 同步数据到服务器
  private async synchronizeData() {
    if (this.syncQueue.length === 0) return;

    const failedItems = [];

    for (const item of this.syncQueue) {
      try {
        // 根据模型类型选择相应的服务
        const result = await this.syncService.syncItem(item);
        
        if (result.success) {
          // 同步成功，从队列中移除
          const index = this.syncQueue.indexOf(item);
          this.syncQueue.splice(index, 1);
          await this.db.delete('syncQueue', item.timestamp);
        } else {
          failedItems.push(item);
        }
      } catch (error) {
        console.error('Error syncing item:', error);
        failedItems.push(item);
      }
    }

    // 更新失败的项目
    this.syncQueue = failedItems;
  }

  // 清理过期数据
  async cleanupExpiredData() {
    const expirationTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30天
    
    const stores = ['healthMetrics', 'activities', 'nutrition', 'sleep', 'mentalHealth'];
    for (const store of stores) {
      await this.db.deleteOlderThan(store, expirationTime);
    }
  }

  // 获取存储使用情况
  async getStorageUsage() {
    const usage = {
      indexedDB: await this.db.getSize(),
      localStorage: this.storage.getSize(),
      syncQueueSize: this.syncQueue.length
    };
    return usage;
  }

  // 数据压缩
  private async compressData(data: any) {
    // 实现数据压缩逻辑
    return data;
  }

  // 数据解压
  private async decompressData(data: any) {
    // 实现数据解压逻辑
    return data;
  }
} 