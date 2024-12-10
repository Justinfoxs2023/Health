import { HealthData } from '../../types';
import { storage } from '../storage';
import { logger } from '../logger';

/** 导出格式类型 */
export type ExportFormat = 'json' | 'csv' | 'excel';

/** 导出配置 */
export interface ExportConfig {
  /** 导出格式 */
  format: ExportFormat;
  /** 是否包含元数据 */
  includeMetadata?: boolean;
  /** 是否加密 */
  encrypt?: boolean;
  /** 加密密钥 */
  encryptionKey?: string;
  /** 文件名前缀 */
  fileNamePrefix?: string;
}

/** 备份配置 */
export interface BackupConfig {
  /** 备份描述 */
  description?: string;
  /** 是否加密 */
  encrypt?: boolean;
  /** 加密密钥 */
  encryptionKey?: string;
  /** 压缩级别 (0-9) */
  compressionLevel?: number;
}

/** 备份元数据 */
export interface BackupMetadata {
  /** 备份ID */
  id: string;
  /** 创建时间 */
  createdAt: Date;
  /** 数据版本 */
  version: string;
  /** 备份描述 */
  description?: string;
  /** 数据大小(字节) */
  size: number;
  /** 是否加密 */
  encrypted: boolean;
  /** 数据条数 */
  recordCount: number;
}

/** 数据导出服务 */
class ExportService {
  private static instance: ExportService;
  private readonly BACKUP_KEY_PREFIX = 'health_backup_';
  private readonly BACKUP_META_KEY = 'health_backup_meta';
  private readonly VERSION = '1.0.0';

  private constructor() {}

  /** 获取实例 */
  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /** 导出数据 */
  public async exportData(
    data: HealthData[],
    config: ExportConfig
  ): Promise<Blob> {
    try {
      // 准备导出数据
      const exportData = this.prepareExportData(data, config);

      // 根据格式处理数据
      let content: string;
      switch (config.format) {
        case 'json':
          content = this.formatAsJson(exportData);
          break;
        case 'csv':
          content = this.formatAsCsv(exportData);
          break;
        case 'excel':
          content = this.formatAsExcel(exportData);
          break;
        default:
          throw new Error('不支持的导出格式');
      }

      // 加密处理
      if (config.encrypt && config.encryptionKey) {
        content = this.encrypt(content, config.encryptionKey);
      }

      // 创建Blob
      const blob = new Blob([content], {
        type: this.getContentType(config.format)
      });

      logger.info('数据导出成功', {
        format: config.format,
        size: blob.size,
        recordCount: data.length
      });

      return blob;
    } catch (error) {
      logger.error('数据导出失败', { error });
      throw error;
    }
  }

  /** 创建备份 */
  public async createBackup(
    data: HealthData[],
    config: BackupConfig = {}
  ): Promise<BackupMetadata> {
    try {
      // 准备备份数据
      const backupData = {
        version: this.VERSION,
        createdAt: new Date(),
        data
      };

      // 序列化数据
      let content = JSON.stringify(backupData);

      // 加密处理
      if (config.encrypt && config.encryptionKey) {
        content = this.encrypt(content, config.encryptionKey);
      }

      // 压缩数据
      const compressedContent = await this.compress(
        content,
        config.compressionLevel
      );

      // 生成备份ID
      const backupId = this.generateBackupId();

      // 保存备份数据
      await storage.setItem(
        this.BACKUP_KEY_PREFIX + backupId,
        compressedContent
      );

      // 创建备份元数据
      const metadata: BackupMetadata = {
        id: backupId,
        createdAt: new Date(),
        version: this.VERSION,
        description: config.description,
        size: compressedContent.length,
        encrypted: Boolean(config.encrypt),
        recordCount: data.length
      };

      // 更新备份元数据列表
      await this.updateBackupMetadata(metadata);

      logger.info('创建备份成功', { backupId, metadata });

      return metadata;
    } catch (error) {
      logger.error('创建备份失败', { error });
      throw error;
    }
  }

  /** 恢复备份 */
  public async restoreBackup(
    backupId: string,
    encryptionKey?: string
  ): Promise<HealthData[]> {
    try {
      // 获取备份数据
      const compressedContent = await storage.getItem(
        this.BACKUP_KEY_PREFIX + backupId
      );

      if (!compressedContent) {
        throw new Error('备份不存在');
      }

      // 解压数据
      const content = await this.decompress(compressedContent);

      // 解密处理
      const decryptedContent = encryptionKey
        ? this.decrypt(content, encryptionKey)
        : content;

      // 解析数据
      const backupData = JSON.parse(decryptedContent);

      // 验证版本
      if (backupData.version !== this.VERSION) {
        throw new Error('备份版本不兼容');
      }

      logger.info('恢复备份成功', {
        backupId,
        recordCount: backupData.data.length
      });

      return backupData.data;
    } catch (error) {
      logger.error('恢复备份失败', { error, backupId });
      throw error;
    }
  }

  /** 获取备份列表 */
  public async getBackupList(): Promise<BackupMetadata[]> {
    try {
      const metadataList = await storage.getItem(this.BACKUP_META_KEY);
      return metadataList || [];
    } catch (error) {
      logger.error('获取备份列表失败', { error });
      throw error;
    }
  }

  /** 删除备份 */
  public async deleteBackup(backupId: string): Promise<void> {
    try {
      // 删除备份数据
      await storage.removeItem(this.BACKUP_KEY_PREFIX + backupId);

      // 更新备份元数据列表
      const metadataList = await this.getBackupList();
      const updatedList = metadataList.filter(meta => meta.id !== backupId);
      await storage.setItem(this.BACKUP_META_KEY, updatedList);

      logger.info('删除备份成功', { backupId });
    } catch (error) {
      logger.error('删除备份失败', { error, backupId });
      throw error;
    }
  }

  /** 准备导出数据 */
  private prepareExportData(
    data: HealthData[],
    config: ExportConfig
  ): any {
    const exportData = {
      data,
      metadata: config.includeMetadata
        ? {
            exportedAt: new Date(),
            version: this.VERSION,
            recordCount: data.length
          }
        : undefined
    };
    return exportData;
  }

  /** 格式化为JSON */
  private formatAsJson(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  /** 格式化为CSV */
  private formatAsCsv(data: any): string {
    const headers = Object.keys(data.data[0]);
    const rows = data.data.map((item: any) =>
      headers.map(header => item[header])
    );
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /** 格式化为Excel */
  private formatAsExcel(data: any): string {
    // 这里使用CSV格式，实际项目中可以使用xlsx库生成真实的Excel文件
    return this.formatAsCsv(data);
  }

  /** 获取内容类型 */
  private getContentType(format: ExportFormat): string {
    switch (format) {
      case 'json':
        return 'application/json';
      case 'csv':
        return 'text/csv';
      case 'excel':
        return 'application/vnd.ms-excel';
      default:
        return 'application/octet-stream';
    }
  }

  /** 生成备份ID */
  private generateBackupId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /** 更新备份元数据 */
  private async updateBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const metadataList = await this.getBackupList();
    metadataList.push(metadata);
    await storage.setItem(this.BACKUP_META_KEY, metadataList);
  }

  /** 加密数据 */
  private encrypt(content: string, key: string): string {
    // 这里使用简单的Base64编码，实际项目中应使用更安全的加密算法
    return Buffer.from(content).toString('base64');
  }

  /** 解密数据 */
  private decrypt(content: string, key: string): string {
    // 这里使用简单的Base64解码，实际项目中应使用更安全的解密算法
    return Buffer.from(content, 'base64').toString();
  }

  /** 压缩数据 */
  private async compress(
    content: string,
    level: number = 6
  ): Promise<string> {
    // 这里返回原始内容，实际项目中可以使用compression库进行压缩
    return content;
  }

  /** 解压数据 */
  private async decompress(content: string): Promise<string> {
    // 这里返回原始内容，实际项目中可以使用compression库进行解压
    return content;
  }
}

export const exportService = ExportService.getInstance(); 