import { ILogger } from '../types/logger';
import { IPermission, IRole, ResourceType } from '../types/permission.types';
import { IRedisClient } from '../infrastructure/redis';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class PermissionService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.Redis) private redis: IRedisClient,
  ) {}

  async checkPermission(userId: string, resource: ResourceType, action: string): Promise<boolean> {
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

  private async loadUserPermissions(userId: string): Promise<IPermission[]> {
    const user = await this.userRepository.findById(userId);
    const roles = await this.roleRepository.findByIds(user.roles);

    return roles.reduce((acc, role) => {
      return [...acc, ...role.permissions];
    }, []);
  }

  private evaluatePermission(
    permissions: IPermission[],
    resource: ResourceType,
    action: string,
  ): boolean {
    return permissions.some(
      permission => permission.resource === resource && permission.actions.includes(action),
    );
  }
}
