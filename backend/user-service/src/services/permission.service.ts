import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';
import { Permission, Role, Resource } from '../types/permission.types';

@injectable()
export class PermissionService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Redis) private redis: RedisClient
  ) {}

  async checkPermission(userId: string, resource: Resource, action: string): Promise<boolean> {
    try {
      const cacheKey = `permissions:${userId}`;
      let permissions = await this.redis.get(cacheKey);

      if (!permissions) {
        permissions = await this.loadUserPermissions(userId);
        await this.redis.setex(cacheKey, 3600, JSON.stringify(permissions));
      } else {
        permissions = JSON.parse(permissions);
      }

      return this.evaluatePermission(permissions, resource, action);
    } catch (error) {
      this.logger.error('权限检查失败', error);
      return false;
    }
  }

  private async loadUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.userRepository.findById(userId);
    const roles = await this.roleRepository.findByIds(user.roles);
    
    return roles.reduce((acc, role) => {
      return [...acc, ...role.permissions];
    }, []);
  }

  private evaluatePermission(permissions: Permission[], resource: Resource, action: string): boolean {
    return permissions.some(permission => 
      permission.resource === resource &&
      permission.actions.includes(action)
    );
  }
} 