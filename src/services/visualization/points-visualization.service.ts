export class PointsVisualizationService {
  private readonly chartGenerator: ChartGenerator;
  private readonly analyticsService: PointsAnalyticsService;
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('PointsVisualization');
  }

  // 生成积分趋势图表
  async generatePointsTrendCharts(userId: string): Promise<PointsCharts> {
    try {
      // 获取积分数据
      const pointsData = await this.analyticsService.getPointsData(userId);
      
      // 生成趋势图表
      const trendChart = await this.chartGenerator.createTrendChart(pointsData);
      
      // 添加预测数据
      await this.addPredictionData(trendChart);
      
      // 添加目标线
      await this.addGoalLines(trendChart, userId);

      return {
        trendChart,
        distributionChart: await this.generateDistributionChart(pointsData),
        comparisonChart: await this.generateComparisonChart(userId),
        interactiveFeatures: this.getInteractiveFeatures()
      };
    } catch (error) {
      this.logger.error('生成积分趋势图表失败', error);
      throw error;
    }
  }

  // 生成积分活动分析图表
  async generateActivityAnalysisCharts(userId: string): Promise<ActivityCharts> {
    try {
      // 获取活动数据
      const activityData = await this.analyticsService.getActivityData(userId);
      
      // 生成活动效果图表
      const effectivenessChart = await this.chartGenerator.createEffectivenessChart(activityData);
      
      // 生成参与度图表
      const engagementChart = await this.chartGenerator.createEngagementChart(activityData);

      return {
        effectivenessChart,
        engagementChart,
        categoryBreakdown: await this.generateCategoryBreakdown(activityData),
        timeDistribution: await this.generateTimeDistribution(activityData)
      };
    } catch (error) {
      this.logger.error('生成活动分析图表失败', error);
      throw error;
    }
  }
} 