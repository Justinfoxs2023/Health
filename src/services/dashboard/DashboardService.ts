import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

export interface IDashboardConfig {
  /** refreshInterval 的描述 */
    refreshInterval: number;
  /** maxDataPoints 的描述 */
    maxDataPoints: number;
  /** retentionPeriod 的描述 */
    retentionPeriod: number;
}

export interface IDashboardWidget {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: chart  gauge  table  status  custom;
  title: string;
  description: string;
  dataSource: string;
  config: Recordstring, any;
  refreshInterval: number;
}

export interface IDashboardLayout {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** widgets 的描述 */
    widgets: Array{
    widgetId: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

/**
 * 仪表板服务
 */
@injectable()
export class DashboardService {
  private widgets: Map<string, IDashboardWidget> = new Map();
  private layouts: Map<string, IDashboardLayout> = new Map();
  private dataCache: Map<string, any[]> = new Map();
  private updateTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private cacheManager: CacheManager,
    @inject() private metricsCollector: MetricsCollector,
  ) {
    this.initializeEventListeners();
  }

  /**
   * 初始化事件监听器
   */
  private initializeEventListeners(): void {
    this.eventBus.subscribe('metrics.update', async (data: any) => {
      await this.handleMetricsUpdate(data);
    });

    this.eventBus.subscribe('widget.refresh', async (widgetId: string) => {
      await this.refreshWidget(widgetId);
    });
  }

  /**
   * 添加仪表板部件
   */
  public async addWidget(widget: IDashboardWidget): Promise<void> {
    if (this.widgets.has(widget.id)) {
      throw new Error(`部件 ${widget.id} 已存在`);
    }

    this.widgets.set(widget.id, widget);
    await this.initializeWidgetData(widget);
    this.startWidgetUpdates(widget);

    this.logger.info(`添加仪表板部件: ${widget.title}`);
  }

  /**
   * 添加仪表板布局
   */
  public addLayout(layout: IDashboardLayout): void {
    if (this.layouts.has(layout.id)) {
      throw new Error(`布局 ${layout.id} 已存在`);
    }

    // 验证所有部件是否存在
    for (const { widgetId } of layout.widgets) {
      if (!this.widgets.has(widgetId)) {
        throw new Error(`部件 ${widgetId} 不存在`);
      }
    }

    this.layouts.set(layout.id, layout);
    this.logger.info(`添加仪表板布局: ${layout.name}`);
  }

  /**
   * 初始化部件数据
   */
  private async initializeWidgetData(widget: IDashboardWidget): Promise<void> {
    try {
      const cacheKey = `widget:${widget.id}:data`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        this.dataCache.set(widget.id, cachedData);
      } else {
        const initialData = await this.fetchWidgetData(widget);
        this.dataCache.set(widget.id, initialData);
        await this.cacheManager.set(cacheKey, initialData, 3600); // 1小时缓存
      }
    } catch (error) {
      this.logger.error(`初始化部件数据失败: ${widget.id}`, error);
      throw error;
    }
  }

  /**
   * 获取部件数据
   */
  private async fetchWidgetData(widget: IDashboardWidget): Promise<any[]> {
    try {
      const metrics = await this.metricsCollector.getMetrics(widget.dataSource);
      return this.transformMetricsData(metrics, widget.config);
    } catch (error) {
      this.logger.error(`获取部件数据失败: ${widget.id}`, error);
      return [];
    }
  }

  /**
   * 转换指���数据
   */
  private transformMetricsData(metrics: any[], config: Record<string, any>): any[] {
    // 根据部件配置转换数据
    return metrics.map(metric => ({
      timestamp: metric.timestamp,
      value: metric.value,
      label: metric.label,
    }));
  }

  /**
   * 启动部件更新
   */
  private startWidgetUpdates(widget: IDashboardWidget): void {
    const interval = widget.refreshInterval || 60000; // 默认1分钟

    const timer = setInterval(async () => {
      await this.refreshWidget(widget.id);
    }, interval);

    this.updateTimers.set(widget.id, timer);
  }

  /**
   * 刷新部件
   */
  private async refreshWidget(widgetId: string): Promise<void> {
    const widget = this.widgets.get(widgetId);
    if (!widget) {
      return;
    }

    try {
      const newData = await this.fetchWidgetData(widget);
      this.dataCache.set(widgetId, newData);

      this.eventBus.publish('widget.updated', {
        widgetId,
        data: newData,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error(`刷新部件失败: ${widgetId}`, error);
    }
  }

  /**
   * 处理指标更新
   */
  private async handleMetricsUpdate(data: any): Promise<void> {
    const affectedWidgets = Array.from(this.widgets.values()).filter(
      widget => widget.dataSource === data.source,
    );

    for (const widget of affectedWidgets) {
      await this.refreshWidget(widget.id);
    }
  }

  /**
   * 获取部件数据
   */
  public async getWidgetData(widgetId: string): Promise<any[]> {
    const widget = this.widgets.get(widgetId);
    if (!widget) {
      throw new Error(`部件 ${widgetId} 不存在`);
    }

    return this.dataCache.get(widgetId) || [];
  }

  /**
   * 获取布局
   */
  public getLayout(layoutId: string): IDashboardLayout {
    const layout = this.layouts.get(layoutId);
    if (!layout) {
      throw new Error(`布局 ${layoutId} 不存在`);
    }

    return layout;
  }

  /**
   * 更新部件配置
   */
  public async updateWidgetConfig(
    widgetId: string,
    config: Partial<IDashboardWidget>,
  ): Promise<void> {
    const widget = this.widgets.get(widgetId);
    if (!widget) {
      throw new Error(`部件 ${widgetId} 不存在`);
    }

    Object.assign(widget, config);
    await this.refreshWidget(widgetId);
  }

  /**
   * 更新布局
   */
  public updateLayout(layoutId: string, updates: Partial<IDashboardLayout>): void {
    const layout = this.layouts.get(layoutId);
    if (!layout) {
      throw new Error(`布局 ${layoutId} 不存在`);
    }

    Object.assign(layout, updates);
  }

  /**
   * 删除部件
   */
  public deleteWidget(widgetId: string): void {
    const timer = this.updateTimers.get(widgetId);
    if (timer) {
      clearInterval(timer);
      this.updateTimers.delete(widgetId);
    }

    this.widgets.delete(widgetId);
    this.dataCache.delete(widgetId);
  }

  /**
   * 删除布局
   */
  public deleteLayout(layoutId: string): void {
    this.layouts.delete(layoutId);
  }

  /**
   * 停止服务
   */
  public stop(): void {
    for (const timer of this.updateTimers.values()) {
      clearInterval(timer);
    }
    this.updateTimers.clear();
  }
}
