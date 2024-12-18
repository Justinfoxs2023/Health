import { EventEmitter } from 'events';
import { Grafana } from '@grafana/api';
import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';

interface IDashboardConfig {
  /** grafana 的描述 */
  grafana: {
    url: string;
    apiKey: string;
  };
  /** refresh 的描述 */
  refresh: number;
  /** retention 的描述 */
  retention: number;
}

export class DashboardService extends EventEmitter {
  private logger: Logger;
  private grafana: Grafana;
  private redis: Redis;
  private config: IDashboardConfig;

  constructor(config: IDashboardConfig) {
    super();
    this.logger = new Logger('DashboardService');
    this.config = config;
    this.redis = new Redis();

    this.initializeGrafana();
  }

  // 创建监控面板
  async createDashboard(template: any): Promise<string> {
    try {
      const dashboard = await this.grafana.createDashboard({
        ...template,
        refresh: this.config.refresh,
      });

      await this.cacheDashboard(dashboard);
      return dashboard.url;
    } catch (error) {
      this.logger.error('创建监控面板失败:', error);
      throw error;
    }
  }

  // 更新面板数据
  async updateDashboardData(dashboardId: string, data: any): Promise<void> {
    try {
      await this.grafana.updateDashboardPanels(dashboardId, data);
    } catch (error) {
      this.logger.error('更新面板数据失败:', error);
      throw error;
    }
  }

  // 获取面板快照
  async getDashboardSnapshot(dashboardId: string): Promise<any> {
    try {
      return await this.grafana.getDashboardSnapshot(dashboardId);
    } catch (error) {
      this.logger.error('获取面板快照失败:', error);
      throw error;
    }
  }
}
