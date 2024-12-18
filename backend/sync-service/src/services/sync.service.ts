import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { Redis } from '../utils/redis';
import { SyncRecord } from '../models/sync-record.model';
import { WebSocket } from 'ws';

export class SyncService {
  private redis: Redis;
  private logger: Logger;
  private eventEmitter: EventEmitter;
  private wsClients: Map<string, WebSocket>;

  constructor() {
    this.redis = new Redis();
    this.logger = new Logger('SyncService');
    this.eventEmitter = new EventEmitter();
    this.wsClients = new Map();
  }

  /**
   * 处理数据同步
   */
  async syncData(
    userId: string,
    deviceId: string,
    data: {
      type: string;
      operation: 'create' | 'update' | 'delete';
      data: any;
      version: number;
    },
  ) {
    try {
      // 检查版本冲突
      const hasConflict = await this.checkVersionConflict(userId, data.type, data.version);

      if (hasConflict) {
        return await this.handleConflict(userId, deviceId, data);
      }

      // 创建同步记录
      const syncRecord = new SyncRecord({
        userId,
        deviceId,
        dataType: data.type,
        operation: data.operation,
        data: data.data,
        version: data.version,
      });

      await syncRecord.save();

      // 执行同步操作
      await this.executeSyncOperation(syncRecord);

      // 通知其他设备
      await this.notifyOtherDevices(userId, deviceId, syncRecord);

      return {
        success: true,
        syncId: syncRecord._id,
        version: data.version,
      };
    } catch (error) {
      this.logger.error('数据同步失败', error);
      throw error;
    }
  }

  /**
   * 检查版本冲突
   */
  private async checkVersionConflict(
    userId: string,
    dataType: string,
    version: number,
  ): Promise<boolean> {
    const latestVersion = await this.getLatestVersion(userId, dataType);
    return version < latestVersion;
  }

  /**
   * 处理冲突
   */
  private async handleConflict(userId: string, deviceId: string, data: any) {
    // 获取服务器版本数据
    const serverData = await this.getServerData(userId, data.type);

    // 根据策略解决冲突
    const resolution = await this.resolveConflict(data.data, serverData);

    // 创建带冲突解决的同步记录
    const syncRecord = new SyncRecord({
      userId,
      deviceId,
      dataType: data.type,
      operation: data.operation,
      data: data.data,
      version: data.version,
      conflictResolution: {
        strategy: resolution.strategy,
        resolvedData: resolution.data,
        resolvedAt: new Date(),
      },
    });

    await syncRecord.save();

    return {
      success: true,
      syncId: syncRecord._id,
      version: data.version + 1,
      conflictResolved: true,
      resolvedData: resolution.data,
    };
  }

  /**
   * 执行同步操作
   */
  private async executeSyncOperation(syncRecord: any) {
    try {
      // 根据操作类型执行相应的数据操作
      switch (syncRecord.operation) {
        case 'create':
          await this.createData(syncRecord);
          break;
        case 'update':
          await this.updateData(syncRecord);
          break;
        case 'delete':
          await this.deleteData(syncRecord);
          break;
      }

      // 更新同步状态
      syncRecord.status = 'completed';
      syncRecord.syncedAt = new Date();
      await syncRecord.save();

      // 更新缓存
      await this.updateCache(syncRecord);
    } catch (error) {
      syncRecord.status = 'failed';
      syncRecord.error = {
        code: error.code || 'SYNC_ERROR',
        message: error.message,
      };
      await syncRecord.save();
      throw error;
    }
  }

  /**
   * ���知其他设备
   */
  private async notifyOtherDevices(userId: string, currentDeviceId: string, syncRecord: any) {
    const notification = {
      type: 'sync_update',
      userId,
      dataType: syncRecord.dataType,
      version: syncRecord.version,
      timestamp: new Date(),
    };

    // 通过WebSocket通知在线设备
    this.wsClients.forEach((ws, deviceId) => {
      if (deviceId !== currentDeviceId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(notification));
      }
    });

    // 为离线设备存储通知
    await this.storeOfflineNotification(userId, notification);
  }

  /**
   * 存储离线通知
   */
  private async storeOfflineNotification(userId: string, notification: any) {
    const key = `offline:notifications:${userId}`;
    await this.redis.lpush(key, JSON.stringify(notification));
    await this.redis.ltrim(key, 0, 99); // 保留最近100条通知
  }
}
