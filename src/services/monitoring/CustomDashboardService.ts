import { ConfigService } from '@nestjs/config';
import { DashboardService } from './DashboardService';
import { EventEmitter } from '../events/event-emitter.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from './metrics.service';

interface IDashboardWidget {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** dataSource 的描述 */
  dataSource: string;
  /** config 的描述 */
  config: any;
  /** position 的描述 */
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** refreshInterval 的描述 */
  refreshInterval?: undefined | number;
}

interface ICustomDashboard {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** owner 的描述 */
  owner: string;
  /** widgets 的描述 */
  widgets: IDashboardWidget;
  /** layout 的描述 */
  layout: {
    columns: number;
    rows: number;
  };
  /** theme 的描述 */
  theme?: undefined | string;
  /** created 的描述 */
  created: Date;
  /** updated 的描述 */
  updated: Date;
}

@Injectable()
export class CustomDashboardService {
  private dashboards = new Map<string, ICustomDashboard>();
  private widgetData = new Map<string, any>();
  private readonly updateInterval: number;

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter,
    private readonly dashboardService: DashboardService,
  ) {
    this.updateInterval = this.config.get('dashboard.update_interval') || 30000;
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadDashboards();
      await this.startDataSync();
      this.logger.info('自定义仪表板服务初始化完成');
    } catch (error) {
      this.logger.error('自定义仪表板服务初始化失败', error);
      throw error;
    }
  }

  // 创建仪表板
  async createDashboard(
    data: Omit<ICustomDashboard, 'id' | 'created' | 'updated'>,
  ): Promise<ICustomDashboard> {
    try {
      const id = `dashboard_${Date.now()}`;
      const dashboard: ICustomDashboard = {
        ...data,
        id,
        created: new Date(),
        updated: new Date(),
      };

      await this.validateDashboard(dashboard);
      this.dashboards.set(id, dashboard);

      this.eventEmitter.emit('dashboard:created', {
        dashboardId: id,
        timestamp: new Date(),
      });

      return dashboard;
    } catch (error) {
      this.logger.error('创建仪表板失败', error);
      throw error;
    }
  }

  // 更新仪表板
  async updateDashboard(id: string, updates: Partial<ICustomDashboard>): Promise<ICustomDashboard> {
    try {
      const dashboard = this.dashboards.get(id);
      if (!dashboard) {
        throw new Error(`仪表板不存在: ${id}`);
      }

      const updatedDashboard = {
        ...dashboard,
        ...updates,
        updated: new Date(),
      };

      await this.validateDashboard(updatedDashboard);
      this.dashboards.set(id, updatedDashboard);

      this.eventEmitter.emit('dashboard:updated', {
        dashboardId: id,
        timestamp: new Date(),
      });

      return updatedDashboard;
    } catch (error) {
      this.logger.error('更新仪表板失败', error);
      throw error;
    }
  }

  // 删除仪表板
  async deleteDashboard(id: string): Promise<void> {
    try {
      if (!this.dashboards.has(id)) {
        throw new Error(`仪表板不存在: ${id}`);
      }

      this.dashboards.delete(id);
      this.eventEmitter.emit('dashboard:deleted', {
        dashboardId: id,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error('删除仪表板失败', error);
      throw error;
    }
  }

  // 添加小部件
  async addWidget(
    dashboardId: string,
    widget: Omit<IDashboardWidget, 'id'>,
  ): Promise<IDashboardWidget> {
    try {
      const dashboard = this.dashboards.get(dashboardId);
      if (!dashboard) {
        throw new Error(`仪表板不存在: ${dashboardId}`);
      }

      const widgetId = `widget_${Date.now()}`;
      const newWidget: IDashboardWidget = {
        ...widget,
        id: widgetId,
      };

      await this.validateWidget(newWidget);
      dashboard.widgets.push(newWidget);
      await this.updateDashboard(dashboardId, { widgets: dashboard.widgets });

      // 初始化小部件数据
      await this.initializeWidgetData(newWidget);

      return newWidget;
    } catch (error) {
      this.logger.error('添加小部件失败', error);
      throw error;
    }
  }

  // 更新小部件
  async updateWidget(
    dashboardId: string,
    widgetId: string,
    updates: Partial<IDashboardWidget>,
  ): Promise<IDashboardWidget> {
    try {
      const dashboard = this.dashboards.get(dashboardId);
      if (!dashboard) {
        throw new Error(`仪表板不存在: ${dashboardId}`);
      }

      const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
      if (widgetIndex === -1) {
        throw new Error(`小部件不存在: ${widgetId}`);
      }

      const updatedWidget = {
        ...dashboard.widgets[widgetIndex],
        ...updates,
      };

      await this.validateWidget(updatedWidget);
      dashboard.widgets[widgetIndex] = updatedWidget;
      await this.updateDashboard(dashboardId, { widgets: dashboard.widgets });

      return updatedWidget;
    } catch (error) {
      this.logger.error('更新小部件失败', error);
      throw error;
    }
  }

  // 删除小部件
  async deleteWidget(dashboardId: string, widgetId: string): Promise<void> {
    try {
      const dashboard = this.dashboards.get(dashboardId);
      if (!dashboard) {
        throw new Error(`仪表板不存在: ${dashboardId}`);
      }

      const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
      if (widgetIndex === -1) {
        throw new Error(`小部件不存在: ${widgetId}`);
      }

      dashboard.widgets.splice(widgetIndex, 1);
      await this.updateDashboard(dashboardId, { widgets: dashboard.widgets });
    } catch (error) {
      this.logger.error('删除小部件失败', error);
      throw error;
    }
  }

  // 获取仪表板数据
  async getDashboardData(id: string): Promise<any> {
    try {
      const dashboard = this.dashboards.get(id);
      if (!dashboard) {
        throw new Error(`仪表板不存在: ${id}`);
      }

      const data = {};
      for (const widget of dashboard.widgets) {
        data[widget.id] = await this.getWidgetData(widget);
      }

      return {
        dashboard,
        data,
      };
    } catch (error) {
      this.logger.error('获取仪表板数据失败', error);
      throw error;
    }
  }

  // ���取小部件数据
  private async getWidgetData(widget: IDashboardWidget): Promise<any> {
    try {
      const cachedData = this.widgetData.get(widget.id);
      if (cachedData && this.isDataFresh(cachedData.timestamp, widget.refreshInterval)) {
        return cachedData.data;
      }

      const data = await this.fetchWidgetData(widget);
      this.widgetData.set(widget.id, {
        data,
        timestamp: new Date(),
      });

      return data;
    } catch (error) {
      this.logger.error(`获取小部件数据失败: ${widget.id}`, error);
      throw error;
    }
  }

  // 检查数据是否需要更新
  private isDataFresh(timestamp: Date, refreshInterval: number = this.updateInterval): boolean {
    return Date.now() - timestamp.getTime() < refreshInterval;
  }

  // 获取小部件数据
  private async fetchWidgetData(widget: IDashboardWidget): Promise<any> {
    switch (widget.type) {
      case 'performance':
        return this.dashboardService.getPerformanceStatus();
      case 'security':
        return this.dashboardService.getSecurityStatus();
      case 'alerts':
        return this.dashboardService.getAlertStatus();
      case 'custom':
        return this.fetchCustomData(widget);
      default:
        return this.dashboardService.getSystemStatus();
    }
  }

  // 获取自定义数据
  private async fetchCustomData(widget: IDashboardWidget): Promise<any> {
    // 实现自定义数据获取逻辑
    return {};
  }

  // 初始化小部件数据
  private async initializeWidgetData(widget: IDashboardWidget): Promise<void> {
    try {
      const data = await this.fetchWidgetData(widget);
      this.widgetData.set(widget.id, {
        data,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error(`初始化小部件数据失败: ${widget.id}`, error);
      throw error;
    }
  }

  // 验证仪表板配置
  private async validateDashboard(dashboard: ICustomDashboard): Promise<void> {
    if (!dashboard.name || !dashboard.owner) {
      throw new Error('仪表板配置无效');
    }

    if (dashboard.widgets) {
      for (const widget of dashboard.widgets) {
        await this.validateWidget(widget);
      }
    }
  }

  // 验证小部件配置
  private async validateWidget(widget: IDashboardWidget): Promise<void> {
    if (!widget.type || !widget.dataSource) {
      throw new Error('小部件配置无效');
    }

    if (widget.position) {
      if (widget.position.x < 0 || widget.position.y < 0) {
        throw new Error('小部件位置无效');
      }
      if (widget.position.width <= 0 || widget.position.height <= 0) {
        throw new Error('小部件大��无效');
      }
    }
  }

  // 加载仪表板配置
  private async loadDashboards(): Promise<void> {
    try {
      const configs = await this.config.get('custom_dashboards');
      if (configs) {
        for (const config of configs) {
          this.dashboards.set(config.id, config);
        }
      }
    } catch (error) {
      this.logger.error('加载仪表板配置失败', error);
      throw error;
    }
  }

  // 启动数据同步
  private async startDataSync(): Promise<void> {
    setInterval(async () => {
      try {
        for (const dashboard of this.dashboards.values()) {
          for (const widget of dashboard.widgets) {
            if (this.shouldUpdateWidget(widget)) {
              await this.updateWidgetData(widget);
            }
          }
        }
      } catch (error) {
        this.logger.error('数据同步失败', error);
      }
    }, this.updateInterval);
  }

  // 检查是否需要更新小部件数据
  private shouldUpdateWidget(widget: IDashboardWidget): boolean {
    const cachedData = this.widgetData.get(widget.id);
    if (!cachedData) return true;

    return !this.isDataFresh(cachedData.timestamp, widget.refreshInterval);
  }

  // 更新小部件数据
  private async updateWidgetData(widget: IDashboardWidget): Promise<void> {
    try {
      const data = await this.fetchWidgetData(widget);
      this.widgetData.set(widget.id, {
        data,
        timestamp: new Date(),
      });

      this.eventEmitter.emit('widget:updated', {
        widgetId: widget.id,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error(`更新小部件数据失败: ${widget.id}`, error);
    }
  }
}
