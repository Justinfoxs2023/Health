import { BaseService } from '../base.service';
import { PermissionError } from '../../utils/errors';
import { RoleService } from './role.service';

export class PermissionService extends BaseService {
  private roleService: RoleService;

  constructor() {
    super('PermissionService');
    this.roleService = new RoleService();
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      // 检查缓存
      const cacheKey = `permissions:${userId}:${resource}:${action}`;
      const cachedResult = await this.redis.get(cacheKey);

      if (cachedResult !== null) {
        return cachedResult === 'true';
      }

      // 获取用户角色和权限
      const userRoles = await this.roleService.getUserRoles(userId);
      const hasPermission = await this.validatePermission(userRoles, resource, action);

      // 缓存结果
      await this.redis.setex(cacheKey, 3600, hasPermission.toString());

      return hasPermission;
    } catch (error) {
      this.logger.error('Permission check failed', error);
      throw new PermissionError('权限验证失败');
    }
  }

  async grantPermission(roleId: string, resource: string, action: string): Promise<void> {
    try {
      await this.roleService.addPermission(roleId, { resource, action });
      await this.clearPermissionCache(roleId);
    } catch (error) {
      this.logger.error('Grant permission failed', error);
      throw error;
    }
  }

  async revokePermission(roleId: string, resource: string, action: string): Promise<void> {
    try {
      await this.roleService.removePermission(roleId, { resource, action });
      await this.clearPermissionCache(roleId);
    } catch (error) {
      this.logger.error('Revoke permission failed', error);
      throw error;
    }
  }

  private async validatePermission(
    roles: string[],
    resource: string,
    action: string,
  ): Promise<boolean> {
    for (const role of roles) {
      const permissions = await this.roleService.getRolePermissions(role);
      if (this.hasRequiredPermission(permissions, resource, action)) {
        return true;
      }
    }
    return false;
  }

  private hasRequiredPermission(permissions: any[], resource: string, action: string): boolean {
    return permissions.some(
      p => p.resource === resource && (p.action === action || p.action === '*'),
    );
  }

  private async clearPermissionCache(roleId: string): Promise<void> {
    const users = await this.roleService.getUsersByRole(roleId);
    const promises = users.map(user => this.redis.del(`permissions:${user.id}:*`));
    await Promise.all(promises);
  }
}
