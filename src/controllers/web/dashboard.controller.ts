import { Request, Response } from 'express';
import { Logger } from '../../utils/logger';
import { DashboardService } from '../../services/web/dashboard.service';
import { AuthService } from '../../services/auth/auth.service';

export class DashboardController {
  private logger: Logger;
  private dashboardService: DashboardService;
  private authService: AuthService;

  constructor() {
    this.logger = new Logger('DashboardController');
    this.dashboardService = new DashboardService();
    this.authService = new AuthService();
  }

  // 获取仪表板数据
  async getDashboard(req: Request, res: Response) {
    try {
      const { userId, orgId } = req.params;
      const { timeRange, filters } = req.query;

      // 验证权限
      await this.authService.verifyDashboardAccess(req.user, orgId);

      // 获取数据
      const dashboard = await this.dashboardService.getDashboard(
        userId,
        orgId,
        {
          timeRange,
          filters
        }
      );

      res.json({
        code: 200,
        data: dashboard,
        message: '获取仪表板成功'
      });
    } catch (error) {
      this.logger.error('获取仪表板失败', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  // 更新仪表板配置
  async updateDashboard(req: Request, res: Response) {
    try {
      const { userId, orgId } = req.params;
      const config = req.body;

      // 验证权限
      await this.authService.verifyDashboardUpdate(req.user, orgId);

      // 更新配置
      const updated = await this.dashboardService.updateDashboard(
        userId,
        orgId,
        config
      );

      res.json({
        code: 200,
        data: updated,
        message: '更新仪表板成功'
      });
    } catch (error) {
      this.logger.error('更新仪表板失败', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 