import { AdminService } from '../../services/admin/admin.service';
import { IAdminConfig } from '../../types/admin';
import { Logger } from '../../utils/logger';
import { Request, Response } from 'express';

export class AdminController {
  private adminService: AdminService;
  private logger: Logger;

  constructor() {
    this.adminService = new AdminService();
    this.logger = new Logger('AdminController');
  }

  // 用户管理
  async handleUserManagement(req: Request, res: Response) {
    try {
      const { action, data } = req.body;
      const result = await this.adminService.manageUsers(action, data);

      return res.json({
        code: 200,
        data: result,
        message: '用户管理操作成功',
      });
    } catch (error) {
      this.logger.error('用户管理操作失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  // 角色管理
  async handleRoleManagement(req: Request, res: Response) {
    try {
      const { action, data } = req.body;
      const result = await this.adminService.manageRoles(action, data);

      return res.json({
        code: 200,
        data: result,
        message: '角色管理操作成功',
      });
    } catch (error) {
      this.logger.error('角色管理操作失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  // 系统配置
  async handleSystemSettings(req: Request, res: Response) {
    try {
      const { action, data } = req.body;
      const result = await this.adminService.manageSettings(action, data);

      return res.json({
        code: 200,
        data: result,
        message: '系统配置操作成功',
      });
    } catch (error) {
      this.logger.error('系统配置操作失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
