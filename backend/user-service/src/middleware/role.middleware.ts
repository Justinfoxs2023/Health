import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { Logger } from '../utils/logger';

export class RoleMiddleware {
  private roleService: RoleService;
  private logger: Logger;

  constructor() {
    this.roleService = new RoleService();
    this.logger = new Logger('RoleMiddleware');
  }

  /**
   * 角色验证中间件
   */
  public hasRole(requiredRole: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user.id;
        const hasRole = await this.roleService.checkUserRole(userId, requiredRole);

        if (!hasRole) {
          return res.status(403).json({
            code: 403,
            message: '没有访问权限'
          });
        }

        next();
      } catch (error) {
        this.logger.error('角色验证失败', error);
        return res.status(500).json({
          code: 500,
          message: '服务器错误'
        });
      }
    };
  }

  /**
   * 权限验证中间件
   */
  public hasPermission(requiredPermission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user.id;
        const hasPermission = await this.roleService.checkUserPermission(
          userId,
          requiredPermission
        );

        if (!hasPermission) {
          return res.status(403).json({
            code: 403,
            message: '没有操作权限'
          });
        }

        next();
      } catch (error) {
        this.logger.error('权限验证失败', error);
        return res.status(500).json({
          code: 500,
          message: '服务器错误'
        });
      }
    };
  }
} 