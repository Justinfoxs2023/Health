import { api } from '../utils/api';

export interface ISharePermission {
  /** reportId 的描述 */
  reportId: string;
  /** userId 的描述 */
  userId: string;
  /** permission 的描述 */
  permission: 'read' | 'edit' | 'admin';
  /** expireAt 的描述 */
  expireAt?: Date;
}

export class SharePermissionService {
  async grantPermission(permission: ISharePermission) {
    try {
      const response = await api.post('/api/share/permission', permission);
      return response.data;
    } catch (error) {
      console.error('Error in share-permission.service.ts:', '授权失败:', error);
      throw error;
    }
  }

  async revokePermission(reportId: string, userId: string) {
    try {
      await api.delete(`/api/share/permission/${reportId}/${userId}`);
    } catch (error) {
      console.error('Error in share-permission.service.ts:', '撤销权限失败:', error);
      throw error;
    }
  }

  async getPermissions(reportId: string) {
    try {
      const response = await api.get(`/api/share/permission/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error in share-permission.service.ts:', '获取权限列表失败:', error);
      throw error;
    }
  }
}
