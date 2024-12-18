import { DataSyncService } from '../sync/DataSyncService';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';

export interface IOfflineData {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: string;
  /** data 的描述 */
    data: any;
  /** status 的描述 */
    status: pending  synced  failed;
  timestamp: Date;
}

@Injectable()
export class OfflineService {
  constructor(
    private readonly logger: Logger,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly dataSyncService: DataSyncService,
  ) {}

  async initialize(): Promise<void> {
    try {
      await this.setupOfflineStorage();
      this.registerSyncEvents();
      this.logger.info('离线服务初始化成功');
    } catch (error) {
      this.logger.error('离线服务初始化失败', error);
      throw error;
    }
  }

  private async setupOfflineStorage(): Promise<void> {
    await this.databaseService.createCollection('offline_data', {
      indexes: [
        { key: { id: 1 }, unique: true },
        { key: { status: 1 } },
        { key: { timestamp: 1 } },
      ],
    });
  }

  private registerSyncEvents(): void {
    this.eventBus.on('network.online', () => this.syncOfflineData());
    this.eventBus.on('network.offline', () => this.enableOfflineMode());
  }

  async saveOfflineData(type: string, data: any): Promise<void> {
    try {
      const offlineData: IOfflineData = {
        id: this.generateId(),
        type,
        data,
        status: 'pending',
        timestamp: new Date(),
      };

      await this.databaseService.create('offline_data', offlineData);
      this.logger.info(`离线数据保存成功: ${type}`);
    } catch (error) {
      this.logger.error('离线数据保存失败', error);
      throw error;
    }
  }

  async syncOfflineData(): Promise<void> {
    try {
      const pendingData = await this.databaseService.find('offline_data', { status: 'pending' });

      for (const data of pendingData) {
        try {
          await this.dataSyncService.syncData(data.type, data.data);
          await this.databaseService.update('offline_data', { id: data.id }, { status: 'synced' });
        } catch (error) {
          this.logger.error(`数据同步失败: ${data.id}`, error);
          await this.databaseService.update('offline_data', { id: data.id }, { status: 'failed' });
        }
      }

      this.logger.info('离线数据同步完成');
    } catch (error) {
      this.logger.error('离线数据同步失败', error);
      throw error;
    }
  }

  private enableOfflineMode(): void {
    this.logger.info('已切换至离线模式');
    this.eventBus.emit('offline.enabled', {});
  }

  async getOfflineData(type: string): Promise<any[]> {
    try {
      const offlineData = await this.databaseService.find('offline_data', { type });
      return offlineData.map(item => item.data);
    } catch (error) {
      this.logger.error(`获取离线数据失败: ${type}`, error);
      throw error;
    }
  }

  async clearSyncedData(beforeDate?: Date): Promise<void> {
    try {
      const query = { status: 'synced' };
      if (beforeDate) {
        query['timestamp'] = { $lt: beforeDate };
      }

      await this.databaseService.deleteMany('offline_data', query);
      this.logger.info('已清理同步完成的离线数据');
    } catch (error) {
      this.logger.error('清理离线数据失败', error);
      throw error;
    }
  }

  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getOfflineStatus(): Promise<{
    pendingCount: number;
    syncedCount: number;
    failedCount: number;
    lastSync?: Date;
  }> {
    try {
      const [pending, synced, failed] = await Promise.all([
        this.databaseService.count('offline_data', { status: 'pending' }),
        this.databaseService.count('offline_data', { status: 'synced' }),
        this.databaseService.count('offline_data', { status: 'failed' }),
      ]);

      const lastSync = await this.databaseService.findOne(
        'offline_data',
        { status: 'synced' },
        { sort: { timestamp: -1 } },
      );

      return {
        pendingCount: pending,
        syncedCount: synced,
        failedCount: failed,
        lastSync: lastSync?.timestamp,
      };
    } catch (error) {
      this.logger.error('获取离线状态失败', error);
      throw error;
    }
  }
}
