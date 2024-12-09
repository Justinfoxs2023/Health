import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { Logger } from '../utils/logger';

export class AdminController {
  private adminService: AdminService;
  private logger: Logger;

  constructor() {
    this.adminService = new AdminService();
    this.logger = new Logger('AdminController');
  }

  /**
   * 用户管理
   */
  public async manageUsers(req: Request, res: Response) {
    try {
      const { action } = req.params;
      const { userId, status, roles } = req.body;

      let result;
      switch (action) {
        case 'status':
          result = await this.adminService.updateUserStatus(userId, status);
          break;
        case 'roles':
          result = await this.adminService.updateUserRoles(userId, roles);
          break;
        case 'delete':
          result = await this.adminService.deleteUser(userId);
          break;
        default:
          return res.status(400).json({
            code: 400,
            message: '不支持的操作'
          });
      }

      return res.json({
        code: 200,
        data: result,
        message: '操作成功'
      });
    } catch (error) {
      this.logger.error('用户管理操作失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 系统日志查看
   */
  public async viewSystemLogs(req: Request, res: Response) {
    try {
      const { startDate, endDate, type, level } = req.query;

      const logs = await this.adminService.getSystemLogs({
        startDate: startDate as string,
        endDate: endDate as string,
        type: type as string,
        level: level as string
      });

      return res.json({
        code: 200,
        data: logs
      });
    } catch (error) {
      this.logger.error('获取系统日志失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 内容管理
   */
  public async manageContent(req: Request, res: Response) {
    try {
      const { action } = req.params;
      const { contentId, status, data } = req.body;

      let result;
      switch (action) {
        case 'review':
          result = await this.adminService.reviewContent(contentId, status);
          break;
        case 'update':
          result = await this.adminService.updateContent(contentId, data);
          break;
        case 'delete':
          result = await this.adminService.deleteContent(contentId);
          break;
        default:
          return res.status(400).json({
            code: 400,
            message: '不支持的操作'
          });
      }

      return res.json({
        code: 200,
        data: result,
        message: '操作成功'
      });
    } catch (error) {
      this.logger.error('内容管理操作失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 