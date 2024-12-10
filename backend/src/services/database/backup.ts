import mongoose from 'mongoose';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { logger } from '../logger';

class DatabaseBackupService {
  private readonly backupDir = path.join(process.cwd(), 'backups');
  private readonly maxBackups = 7; // 保留最近7天的备份

  constructor() {
    // 确保备份目录存在
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 执行数据库备份
   */
  async performBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

    try {
      await this.mongoDump(backupPath);
      await this.validateBackup(backupPath);
      await this.cleanOldBackups();
      
      logger.info('数据库备份完成:', backupPath);
      return {
        status: 'success',
        path: backupPath,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('数据库备份失败:', error);
      throw error;
    }
  }

  /**
   * 执行数据库恢复
   */
  async performRestore(backupPath: string) {
    try {
      // 验证备份文件
      await this.validateBackup(backupPath);
      
      // 执行恢复
      await this.mongoRestore(backupPath);
      
      logger.info('数据库恢复完成:', backupPath);
      return {
        status: 'success',
        path: backupPath,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('数据库恢复失败:', error);
      throw error;
    }
  }

  /**
   * 执行mongodump命令
   */
  private async mongoDump(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { MONGODB_URI, MONGODB_USER, MONGODB_PASSWORD } = process.env;
      
      const args = [
        '--uri', MONGODB_URI as string,
        '--out', backupPath,
        '--gzip'
      ];

      if (MONGODB_USER && MONGODB_PASSWORD) {
        args.push('--username', MONGODB_USER);
        args.push('--password', MONGODB_PASSWORD);
        args.push('--authenticationDatabase', 'admin');
      }

      const mongodump = spawn('mongodump', args);

      mongodump.stdout.on('data', (data) => {
        logger.info('mongodump:', data.toString());
      });

      mongodump.stderr.on('data', (data) => {
        logger.error('mongodump error:', data.toString());
      });

      mongodump.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`mongodump exited with code ${code}`));
        }
      });
    });
  }

  /**
   * 执行mongorestore命令
   */
  private async mongoRestore(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { MONGODB_URI, MONGODB_USER, MONGODB_PASSWORD } = process.env;
      
      const args = [
        '--uri', MONGODB_URI as string,
        '--dir', backupPath,
        '--gzip',
        '--drop' // 恢复前删除现有数据
      ];

      if (MONGODB_USER && MONGODB_PASSWORD) {
        args.push('--username', MONGODB_USER);
        args.push('--password', MONGODB_PASSWORD);
        args.push('--authenticationDatabase', 'admin');
      }

      const mongorestore = spawn('mongorestore', args);

      mongorestore.stdout.on('data', (data) => {
        logger.info('mongorestore:', data.toString());
      });

      mongorestore.stderr.on('data', (data) => {
        logger.error('mongorestore error:', data.toString());
      });

      mongorestore.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`mongorestore exited with code ${code}`));
        }
      });
    });
  }

  /**
   * 验证备份
   */
  private async validateBackup(backupPath: string): Promise<void> {
    try {
      // 检查备份文件是否存在
      if (!fs.existsSync(backupPath)) {
        throw new Error('备份文件不存在');
      }

      // 检查备份文件完整性
      const files = await fs.promises.readdir(backupPath);
      if (files.length === 0) {
        throw new Error('备份文件为空');
      }

      // 检查关键集合是否存在
      const requiredCollections = ['users', 'health_data', 'settings'];
      const missingCollections = requiredCollections.filter(
        collection => !files.some(file => file.includes(collection))
      );

      if (missingCollections.length > 0) {
        throw new Error(`缺少关键集合备份: ${missingCollections.join(', ')}`);
      }
    } catch (error) {
      logger.error('备份验证失败:', error);
      throw error;
    }
  }

  /**
   * 清理旧备份
   */
  private async cleanOldBackups(): Promise<void> {
    try {
      const files = await fs.promises.readdir(this.backupDir);
      const backups = files
        .filter(file => file.startsWith('backup-'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      // 删除超过保留数量的旧备份
      if (backups.length > this.maxBackups) {
        const oldBackups = backups.slice(this.maxBackups);
        for (const backup of oldBackups) {
          await fs.promises.rm(backup.path, { recursive: true });
          logger.info('删除旧备份:', backup.path);
        }
      }
    } catch (error) {
      logger.error('清理旧备份失败:', error);
      throw error;
    }
  }

  /**
   * 获取备份列表
   */
  async getBackupList() {
    try {
      const files = await fs.promises.readdir(this.backupDir);
      const backups = files
        .filter(file => file.startsWith('backup-'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          size: fs.statSync(path.join(this.backupDir, file)).size,
          time: fs.statSync(path.join(this.backupDir, file)).mtime
        }))
        .sort((a, b) => b.time.getTime() - a.time.getTime());

      return backups;
    } catch (error) {
      logger.error('获取备份列表失败:', error);
      throw error;
    }
  }
}

export const databaseBackupService = new DatabaseBackupService(); 