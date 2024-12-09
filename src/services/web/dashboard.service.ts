import { Logger } from '../../utils/logger';
import { DashboardConfig } from '../../types/web';
import { HealthDataService } from '../health/health-data.service';
import { VisualizationService } from '../visualization/visualization.service';

export class DashboardService {
  private logger: Logger;
  private healthDataService: HealthDataService;
  private visualizationService: VisualizationService;

  constructor() {
    this.logger = new Logger('DashboardService');
    this.healthDataService = new HealthDataService();
    this.visualizationService = new VisualizationService();
  }

  // 获取仪表板数据
  async getDashboard(
    userId: string,
    orgId: string,
    options: DashboardOptions
  ): Promise<Dashboard> {
    try {
      // 1. 获取用户配置
      const config = await this.getDashboardConfig(userId, orgId);
      
      // 2. 获取健康数据
      const healthData = await this.healthDataService.getHealthData(
        userId,
        options.timeRange
      );
      
      // 3. 应用过滤器
      const filteredData = await this.applyFilters(healthData, options.filters);
      
      // 4. 生成可视化
      const visualizations = await this.generateVisualizations(
        filteredData,
        config
      );
      
      // 5. 组装仪表板
      return this.assembleDashboard(visualizations, config);
    } catch (error) {
      this.logger.error('获取仪表板数据失败', error);
      throw error;
    }
  }

  // 更新仪表板配置
  async updateDashboard(
    userId: string,
    orgId: string,
    config: DashboardConfig
  ): Promise<DashboardConfig> {
    try {
      // 1. 验证配置
      await this.validateConfig(config);
      
      // 2. 保存配置
      const savedConfig = await this.saveDashboardConfig(
        userId,
        orgId,
        config
      );
      
      // 3. 更新缓存
      await this.updateConfigCache(userId, orgId, savedConfig);
      
      return savedConfig;
    } catch (error) {
      this.logger.error('更新仪表板配置失败', error);
      throw error;
    }
  }
} 