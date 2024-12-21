import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class DataSyncService {
  private readonly syncInterval: number = 60000; // 1分钟
  private readonly syncJobs: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
  ) {}

  async startSync(config: {
    source: string;
    target: string;
    collections: string[];
    type: 'full' | 'incremental';
    interval?: number;
  }): Promise<void> {
    try {
      // 验证同步配置
      await this.validateSyncConfig(config);

      // 创建同步任务
      const syncId = `${config.source}-${config.target}`;

      // 停止已存在的同步任务
      if (this.syncJobs.has(syncId)) {
        clearInterval(this.syncJobs.get(syncId));
      }

      // 执行初始同步
      await this.performSync(config);

      // 设置定期同步
      const interval = setInterval(async () => {
        try {
          await this.performSync(config);
        } catch (error) {
          this.logger.error(`同步失败: ${syncId}`, error);
        }
      }, config.interval || this.syncInterval);

      this.syncJobs.set(syncId, interval);

      // 发送同步启动事件
      await this.eventBus.emit('sync.started', { config });
    } catch (error) {
      this.logger.error('启动同步失败', error);
      throw error;
    }
  }

  private async validateSyncConfig(config: any): Promise<void> {
    if (!config.source || !config.target) {
      throw new Error('源和目标数据库不能为空');
    }

    if (!config.collections || config.collections.length === 0) {
      throw new Error('同步集合不能为空');
    }

    // 验证数据库连接
    await this.databaseService.validateConnection(config.source);
    await this.databaseService.validateConnection(config.target);
  }

  private async performSync(config: any): Promise<void> {
    const syncId = `${config.source}-${config.target}`;
    const startTime = Date.now();

    try {
      // 获取同步状态
      const lastSync = await this.getLastSyncTime(syncId);

      for (const collection of config.collections) {
        // 获取需要同步的数据
        const data = await this.getSyncData(config, collection, lastSync);

        if (data.length > 0) {
          // 执行同步
          await this.syncData(config, collection, data);

          // 更新同步状态
          await this.updateSyncStatus(syncId, collection, {
            lastSync: new Date(),
            recordCount: data.length,
            duration: Date.now() - startTime,
          });
        }
      }

      // 发送同步完成事件
      await this.eventBus.emit('sync.completed', {
        syncId,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      // 发送同步失败事件
      await this.eventBus.emit('sync.failed', {
        syncId,
        error: error.message,
      });
      throw error;
    }
  }

  private async getLastSyncTime(syncId: string): Promise<Date | null> {
    const status = await this.databaseService.findOne('sync_status', { syncId });
    return status ? status.lastSync : null;
  }

  private async getSyncData(
    config: any,
    collection: string,
    lastSync: Date | null,
  ): Promise<any[]> {
    const query: any = {};

    if (config.type === 'incremental' && lastSync) {
      query.updatedAt = { $gt: lastSync };
    }

    return await this.databaseService.find(collection, query, {
      source: config.source,
    });
  }

  private async syncData(config: any, collection: string, data: any[]): Promise<void> {
    // 批量更新目标数据库
    await this.databaseService.bulkWrite(collection, data, {
      target: config.target,
    });
  }

  private async updateSyncStatus(syncId: string, collection: string, status: any): Promise<void> {
    await this.databaseService.update(
      'sync_status',
      { syncId, collection },
      {
        ...status,
        updatedAt: new Date(),
      },
      { upsert: true },
    );
  }

  async stopSync(syncId: string): Promise<void> {
    try {
      // 停止同步任务
      if (this.syncJobs.has(syncId)) {
        clearInterval(this.syncJobs.get(syncId));
        this.syncJobs.delete(syncId);
      }

      // 更新同步状态
      await this.databaseService.update(
        'sync_status',
        { syncId },
        {
          status: 'stopped',
          updatedAt: new Date(),
        },
      );

      // 发送同步停止事件
      await this.eventBus.emit('sync.stopped', { syncId });
    } catch (error) {
      this.logger.error('停止同步失败', error);
      throw error;
    }
  }

  async createBackup(config: {
    source: string;
    target: string;
    collections: string[];
    type: 'full' | 'differential';
  }): Promise<void> {
    try {
      // 创建备份记录
      const backup = await this.databaseService.create('backups', {
        ...config,
        status: 'in_progress',
        startTime: new Date(),
        createdAt: new Date(),
      });

      // 执行备份
      for (const collection of config.collections) {
        await this.backupCollection(backup._id, collection, config);
      }

      // 更新备份状态
      await this.databaseService.update(
        'backups',
        { _id: backup._id },
        {
          status: 'completed',
          endTime: new Date(),
          updatedAt: new Date(),
        },
      );

      // 发送备份完成事件
      await this.eventBus.emit('backup.completed', { backup });
    } catch (error) {
      this.logger.error('创建备份失败', error);
      throw error;
    }
  }

  private async backupCollection(backupId: string, collection: string, config: any): Promise<void> {
    try {
      // 获取需要备份的数据
      const query: any = {};
      if (config.type === 'differential') {
        const lastBackup = await this.getLastBackup(config.source, collection);
        if (lastBackup) {
          query.updatedAt = { $gt: lastBackup.endTime };
        }
      }

      const data = await this.databaseService.find(collection, query, {
        source: config.source,
      });

      if (data.length > 0) {
        // 创建备份集合
        const backupCollection = `${collection}_backup_${backupId}`;
        await this.databaseService.createCollection(backupCollection, {
          target: config.target,
        });

        // 写入备份数据
        await this.databaseService.bulkWrite(backupCollection, data, {
          target: config.target,
        });

        // 更新备份详情
        await this.databaseService.create('backup_details', {
          backupId,
          collection,
          recordCount: data.length,
          size: await this.databaseService.getCollectionSize(backupCollection, {
            target: config.target,
          }),
          createdAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.error(`备份集合失败: ${collection}`, error);
      throw error;
    }
  }

  private async getLastBackup(source: string, collection: string): Promise<any> {
    return await this.databaseService.findOne(
      'backups',
      {
        source,
        collections: collection,
        status: 'completed',
      },
      {
        sort: { endTime: -1 },
      },
    );
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      // 获取备份信息
      const backup = await this.databaseService.findOne('backups', { _id: backupId });
      if (!backup) {
        throw new Error('备份不存在');
      }

      // 开始恢复
      await this.databaseService.update(
        'backups',
        { _id: backupId },
        {
          restoreStatus: 'in_progress',
          restoreStartTime: new Date(),
          updatedAt: new Date(),
        },
      );

      // 恢复每个集合
      for (const collection of backup.collections) {
        await this.restoreCollection(backupId, collection, backup);
      }

      // 更新恢复状态
      await this.databaseService.update(
        'backups',
        { _id: backupId },
        {
          restoreStatus: 'completed',
          restoreEndTime: new Date(),
          updatedAt: new Date(),
        },
      );

      // 发送恢复完成事件
      await this.eventBus.emit('backup.restored', { backup });
    } catch (error) {
      this.logger.error('恢复备份失败', error);
      throw error;
    }
  }

  private async restoreCollection(
    backupId: string,
    collection: string,
    backup: any,
  ): Promise<void> {
    try {
      const backupCollection = `${collection}_backup_${backupId}`;

      // 获取备份数据
      const data = await this.databaseService.find(
        backupCollection,
        {},
        {
          target: backup.target,
        },
      );

      if (data.length > 0) {
        // 清空目标集合
        await this.databaseService.deleteMany(
          collection,
          {},
          {
            source: backup.source,
          },
        );

        // 恢复数据
        await this.databaseService.bulkWrite(collection, data, {
          source: backup.source,
        });

        // 更新恢复详情
        await this.databaseService.create('restore_details', {
          backupId,
          collection,
          recordCount: data.length,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.error(`恢复集合失败: ${collection}`, error);
      throw error;
    }
  }

  async getSyncStatus(syncId: string): Promise<any> {
    try {
      return await this.databaseService.find('sync_status', { syncId });
    } catch (error) {
      this.logger.error('获取同步状态失败', error);
      throw error;
    }
  }

  async getBackupStatus(backupId: string): Promise<any> {
    try {
      const [backup, details] = await Promise.all([
        this.databaseService.findOne('backups', { _id: backupId }),
        this.databaseService.find('backup_details', { backupId }),
      ]);

      return {
        ...backup,
        details,
      };
    } catch (error) {
      this.logger.error('获取备份状态失败', error);
      throw error;
    }
  }
}
