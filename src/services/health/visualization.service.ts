import { ChartService } from '../chart/chart.service';
import { Logger } from '../../utils/logger';

export class HealthVisualizationService {
  private logger: Logger;
  private chartService: ChartService;

  constructor() {
    this.logger = new Logger('HealthVisualization');
    this.chartService = new ChartService();
  }

  // 生成健康仪表板
  async generateHealthDashboard(userId: string, config: DashboardConfig): Promise<Dashboard> {
    try {
      // 1. 收集数据
      const healthData = await this.collectHealthData(userId, config.timeRange);

      // 2. 处理数据
      const processedData = await this.processDataForVisualization(healthData);

      // 3. 创建图表
      const charts = await this.createCharts(processedData, config);

      // 4. 组装仪表板
      return {
        userId,
        timestamp: new Date(),
        charts,
        summary: await this.generateDashboardSummary(processedData),
        interactiveFeatures: await this.setupInteractiveFeatures(charts),
      };
    } catch (error) {
      this.logger.error('生成健康仪表板失败', error);
      throw error;
    }
  }

  // 生成健康报告图表
  async generateHealthReportCharts(reportData: any, config: ChartConfig): Promise<ChartSet> {
    try {
      // 1. 分析数据
      const analysis = await this.analyzeReportData(reportData);

      // 2. 选择图表类型
      const chartTypes = this.selectChartTypes(analysis);

      // 3. 生成图表
      const charts = await Promise.all(
        chartTypes.map(type => this.createChart(reportData, type, config)),
      );

      // 4. 添加交互
      return this.addInteractivity(charts);
    } catch (error) {
      this.logger.error('生成健康报告图表失败', error);
      throw error;
    }
  }
}
