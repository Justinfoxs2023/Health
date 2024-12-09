import { api } from '../utils/api';

export interface SharePermission {
  reportId: string;
  userId: string;
  permission: 'read' | 'edit' | 'admin';
  expireAt?: Date;
}

export class SharePermissionService {
  async grantPermission(permission: SharePermission) {
    try {
      const response = await api.post('/api/share/permission', permission);
      return response.data;
    } catch (error) {
      console.error('授权失败:', error);
      throw error;
    }
  }

  async revokePermission(reportId: string, userId: string) {
    try {
      await api.delete(`/api/share/permission/${reportId}/${userId}`);
    } catch (error) {
      console.error('撤销权限失败:', error);
      throw error;
    }
  }

  async getPermissions(reportId: string) {
    try {
      const response = await api.get(`/api/share/permission/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('获取权限列表失败:', error);
      throw error;
    }
  }
} 