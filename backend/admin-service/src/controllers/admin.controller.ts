import { AdminService } from '../services/admin.service';
import { AuditService } from '../services/audit.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export class AdminController {
  private adminService: AdminService;
  private auditService: AuditService;
  private logger: Logger;

  constructor() {
    this.adminService = new AdminService();
    this.auditService = new AuditService();
    this.logger = new Logger('AdminController');
  }

  /**
   * 获取用户列表
   */
  async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, role } = req.query;

      const users = await this.adminService.getUsers({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        role: role as string,
      });

      return res.json({
        code: 200,
        data: users,
      });
    } catch (error) {
      this.logger.error('获取用户列表失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 更新用户角色
   */
  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { roles } = req.body;
      const adminId = req.user.id;

      await this.adminService.updateUserRoles(userId, roles);

      // 记录审计日志
      await this.auditService.log({
        userId: adminId,
        action: 'UPDATE_USER_ROLES',
        resource: `user:${userId}`,
        details: { roles },
      });

      return res.json({
        code: 200,
        message: '角色更新成功',
      });
    } catch (error) {
      this.logger.error('更新用户角色失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 系统配置管理
   */
  async updateSystemConfig(req: Request, res: Response) {
    try {
      const { config } = req.body;
      const adminId = req.user.id;

      await this.adminService.updateSystemConfig(config);

      // 记录审计日志
      await this.auditService.log({
        userId: adminId,
        action: 'UPDATE_SYSTEM_CONFIG',
        resource: 'system:config',
        details: { config },
      });

      return res.json({
        code: 200,
        message: '配置更新成功',
      });
    } catch (error) {
      this.logger.error('更新系统配置失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 获取操作日志
   */
  async getAuditLogs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, startDate, endDate, userId } = req.query;

      const logs = await this.auditService.getLogs({
        page: Number(page),
        limit: Number(limit),
        startDate: startDate as string,
        endDate: endDate as string,
        userId: userId as string,
      });

      return res.json({
        code: 200,
        data: logs,
      });
    } catch (error) {
      this.logger.error('获取操作日志失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
