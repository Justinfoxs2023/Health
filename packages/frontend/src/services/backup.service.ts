import { api } from '../utils/api';

export interface BackupConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  autoBackup: boolean;
  storageType: 'cloud' | 'local';
}

export class BackupService {
  async createBackup() {
    try {
      const response = await api.post('/api/backup/create');
      return response.data;
    } catch (error) {
      console.error('创建备份失败:', error);
      throw error;
    }
  }

  async restoreFromBackup(backupId: string) {
    try {
      const response = await api.post(`/api/backup/restore/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('恢复备份失败:', error);
      throw error;
    }
  }

  async getBackupList() {
    try {
      const response = await api.get('/api/backup/list');
      return response.data;
    } catch (error) {
      console.error('获取备份列表失败:', error);
      throw error;
    }
  }
} 