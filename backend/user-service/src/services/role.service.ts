import { Logger } from '../utils/logger';
import { RedisClient } from '../utils/redis';
import { Role } from '../models/role.model';
import { RoleCodeType, RoleConfigMapType, IUserWithRoles } from '../types/role';
import { RoleConfig } from '../config/role.config';
import { User } from '../models/user.model';

export class RoleService {
  private redis: RedisClient;
  private logger: Logger;
  private roleConfig: RoleConfigMapType;

  constructor() {
    this.redis = new RedisClient();
    this.logger = new Logger('RoleService');
    this.roleConfig = RoleConfig as RoleConfigMapType;
  }

  /**
   * 检查用户角色
   */
  public async checkUserRole(userId: string, roleCode: RoleCodeType): Promise<boolean> {
    try {
      // 检查缓存
      const cacheKey = `user:roles:${userId}`;
      let userRoles = await this.redis.get(cacheKey);

      if (!userRoles) {
        // 从数据库获取用户角色
        const user = (await User.findById(userId).populate('roles')) as IUserWithRoles;
        if (!user) return false;

        userRoles = JSON.stringify(user.roles.map(role => role.code));

        // 缓存用户角色
        await this.redis.setex(cacheKey, 3600, userRoles);
      }

      const parsedRoles = JSON.parse(userRoles) as RoleCodeType[];
      return parsedRoles.includes(roleCode);
    } catch (error) {
      this.logger.error('检查用户角色失败', error);
      throw error;
    }
  }

  /**
   * 检查用户权限
   */
  public async checkUserPermission(userId: string, permission: string): Promise<boolean> {
    try {
      // 获取用户角色
      const user = (await User.findById(userId).populate('roles')) as IUserWithRoles;
      if (!user) return false;

      // 检查每个角色的权限
      for (const role of user.roles) {
        const roleConfig = this.roleConfig[role.code];
        if (roleConfig?.permissions.includes(permission)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      this.logger.error('检查用户权限失败', error);
      throw error;
    }
  }

  /**
   * 分配用户角色
   */
  public async assignUserRole(userId: string, roleCode: RoleCodeType): Promise<void> {
    try {
      // 验证角色是否存在
      const role = await Role.findOne({ code: roleCode });
      if (!role) {
        throw new Error('角色不存在');
      }

      // 更新用户角色
      await User.findByIdAndUpdate(userId, {
        $addToSet: { roles: role._id },
      });

      // 清除用户角色缓存
      await this.redis.del(`user:roles:${userId}`);
    } catch (error) {
      this.logger.error('分配用户角色失败', error);
      throw error;
    }
  }

  /**
   * 获取角色权限列表
   */
  public async getRolePermissions(roleCode: RoleCodeType): Promise<string[]> {
    try {
      const roleConfig = this.roleConfig[roleCode];
      if (!roleConfig) {
        throw new Error(`角色不存在: ${roleCode}`);
      }

      return roleConfig.permissions;
    } catch (error) {
      this.logger.error('获取角色权限失败', error);
      throw error;
    }
  }
}
