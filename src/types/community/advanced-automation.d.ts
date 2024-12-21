/**
 * @fileoverview TS 文件 advanced-automation.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 内容自动化
export interface IContentAutomation {
  /** intelligentPublishing 的描述 */
  intelligentPublishing: {
    contentOptimization: OptimizationConfig;
    timingOptimization: TimingConfig;
    multiChannelDistribution: DistributionConfig;
  };
  /** automatedModeration 的描述 */
  automatedModeration: {
    contentFiltering: FilterConfig;
    qualityAssurance: QAConfig;
    violationDetection: DetectionConfig;
  };
  /** performanceAnalysis 的描述 */
  performanceAnalysis: IPerformanceMetrics;
  /** optimizationSuggestions 的描述 */
  optimizationSuggestions: Suggestion[];
}

// 高级分析
export interface IAdvancedAnalytics {
  /** predictiveAnalytics 的描述 */
  predictiveAnalytics: {
    userBehaviorPrediction: PredictionModel;
    trendForecasting: ForecastModel;
    engagementPrediction: EngagementModel;
  };
  /** realTimeAnalytics 的描述 */
  realTimeAnalytics: {
    liveMonitoring: MonitoringSystem;
    instantAnalysis: AnalysisSystem;
    alertSystem: AlertConfig;
  };
  /** insightGeneration 的描述 */
  insightGeneration: InsightEngine;
  /** recommendationEngine 的描述 */
  recommendationEngine: RecommendationSystem;
}

// 报告系统
export interface IReportingSystem {
  /** automatedReports 的描述 */
  automatedReports: {
    dailySnapshots: Report;
    weeklyAnalysis: Analysis;
    monthlyInsights: Insight;
    customReports: CustomReport;
  };
  /** visualizationSystem 的描述 */
  visualizationSystem: {
    dataVisualization: Visualization[];
    interactiveDashboards: Dashboard[];
    customCharts: Chart[];
  };
  /** distributionSystem 的描述 */
  distributionSystem: DistributionConfig;
  /** insightAnnotation 的描述 */
  insightAnnotation: AnnotationSystem;
}

// 用户洞察
export interface IUserInsights {
  /** behaviorAnalysis 的描述 */
  behaviorAnalysis: {
    userJourney: JourneyAnalysis;
    preferenceProfiling: PreferenceProfile;
    satisfactionTracking: SatisfactionMetrics;
  };
  /** personalizationEngine 的描述 */
  personalizationEngine: {
    contentPersonalization: PersonalizationConfig;
    experienceOptimization: OptimizationConfig;
    recommendationSystem: RecommendationConfig;
  };
  /** insightReports 的描述 */
  insightReports: InsightReport[];
  /** actionableSuggestions 的描述 */
  actionableSuggestions: ActionItem[];
}
