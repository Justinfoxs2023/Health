import fs from 'fs';
import path from 'path';
import { logger } from '../logger';
import { spawn } from 'child_process';

class BackupService {
  private readonly backupDir: string;
  private readonly maxBackups: number = 7; // 保留最近7天的备份

  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 执行数据库备份
   */
  async backup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}.gz`);

    try {
      await this.executeBackup(backupPath);
      await this.cleanOldBackups();
      logger.info('数据库备份完成:', backupPath);
      return backupPath;
    } catch (error) {
      logger.error('数据库备份失败:', error);
      throw error;
    }
  }

  /**
   * 执行数据库恢复
   */
  async restore(backupPath: string): Promise<void> {
    try {
      await this.executeRestore(backupPath);
      logger.info('数据库恢复完成:', backupPath);
    } catch (error) {
      logger.error('数据库恢复失败:', error);
      throw error;
    }
  }

  /**
   * 获取备份列表
   */
  async getBackupList(): Promise<Array<{ path: string; size: number; created: Date }>> {
    try {
      const files = await fs.promises.readdir(this.backupDir);
      const backups = await Promise.all(
        files
          .filter(file => file.startsWith('backup-') && file.endsWith('.gz'))
          .map(async file => {
            const filePath = path.join(this.backupDir, file);
            const stats = await fs.promises.stat(filePath);
            return {
              path: filePath,
              size: stats.size,
              created: stats.ctime,
            };
          }),
      );

      return backups.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      logger.error('获取备份列表失败:', error);
      throw error;
    }
  }

  /**
   * 执行备份命令
   */
  private executeBackup(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const mongodump = spawn('mongodump', [
        '--uri',
        process.env.MONGODB_URI || 'mongodb://localhost:27017/health_management_dev',
        '--gzip',
        '--archive=' + backupPath,
      ]);

      let error = '';

      mongodump.stderr.on('data', data => {
        error += data;
      });

      mongodump.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`备份失败: ${error}`));
        }
      });

      mongodump.on('error', err => {
        reject(err);
      });
    });
  }

  /**
   * 执行恢复命令
   */
  private executeRestore(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', [
        '--uri',
        process.env.MONGODB_URI || 'mongodb://localhost:27017/health_management_dev',
        '--gzip',
        '--archive=' + backupPath,
        '--drop', // 恢复前删除现有数据
      ]);

      let error = '';

      mongorestore.stderr.on('data', data => {
        error += data;
      });

      mongorestore.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`恢复失败: ${error}`));
        }
      });

      mongorestore.on('error', err => {
        reject(err);
      });
    });
  }

  /**
   * 清理旧备份
   */
  private async cleanOldBackups(): Promise<void> {
    try {
      const backups = await this.getBackupList();
      if (backups.length > this.maxBackups) {
        const oldBackups = backups.slice(this.maxBackups);
        await Promise.all(oldBackups.map(backup => fs.promises.unlink(backup.path)));
        logger.info(`已清理 ${oldBackups.length} 个旧备份`);
      }
    } catch (error) {
      logger.error('清理旧备份失败:', error);
    }
  }

  /**
   * 验证备份文件
   */
  async validateBackup(backupPath: string): Promise<boolean> {
    try {
      const stats = await fs.promises.stat(backupPath);
      if (stats.size === 0) {
        throw new Error('备份文件为空');
      }

      // 检查文件完整性
      const testRestore = spawn('mongorestore', [
        '--uri',
        process.env.MONGODB_URI || 'mongodb://localhost:27017/health_management_test',
        '--gzip',
        '--archive=' + backupPath,
        '--dryRun', // 仅测试，不实际恢复
      ]);

      return new Promise((resolve, reject) => {
        let error = '';

        testRestore.stderr.on('data', data => {
          error += data;
        });

        testRestore.on('close', code => {
          if (code === 0) {
            resolve(true);
          } else {
            reject(new Error(`备份验证失败: ${error}`));
          }
        });

        testRestore.on('error', err => {
          reject(err);
        });
      });
    } catch (error) {
      logger.error('备份验证失败:', error);
      return false;
    }
  }

  /**
   * 计算备份统计信息
   */
  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup: Date;
    newestBackup: Date;
  }> {
    try {
      const backups = await this.getBackupList();
      if (backups.length === 0) {
        return {
          totalBackups: 0,
          totalSize: 0,
          oldestBackup: new Date(),
          newestBackup: new Date(),
        };
      }

      return {
        totalBackups: backups.length,
        totalSize: backups.reduce((sum, backup) => sum + backup.size, 0),
        oldestBackup: backups[backups.length - 1].created,
        newestBackup: backups[0].created,
      };
    } catch (error) {
      logger.error('获取备份统计信息失败:', error);
      throw error;
    }
  }
}

export const backupService = new BackupService();
