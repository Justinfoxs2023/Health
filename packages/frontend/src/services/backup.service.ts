import { api } from '../utils/api';

export interface IBackupConfig {
  /** frequency 的描述 */
  frequency: 'daily' | 'weekly' | 'monthly';
  /** autoBackup 的描述 */
  autoBackup: boolean;
  /** storageType 的描述 */
  storageType: 'cloud' | 'local';
}

export class BackupService {
  async createBackup() {
    try {
      const response = await api.post('/api/backup/create');
      return response.data;
    } catch (error) {
      console.error('Error in backup.service.ts:', '创建备份失败:', error);
      throw error;
    }
  }

  async restoreFromBackup(backupId: string) {
    try {
      const response = await api.post(`/api/backup/restore/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('Error in backup.service.ts:', '恢复备份失败:', error);
      throw error;
    }
  }

  async getBackupList() {
    try {
      const response = await api.get('/api/backup/list');
      return response.data;
    } catch (error) {
      console.error('Error in backup.service.ts:', '获取备份列表失败:', error);
      throw error;
    }
  }
}
