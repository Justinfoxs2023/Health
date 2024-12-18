/**
 * @fileoverview TS 文件 operation-management.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 内容管理
export interface IContentManagement {
  /** contentCalendar 的描述 */
  contentCalendar: {
    dailyTopics: TopicPlan;
    eventSchedule: EventPlan;
    contentReview: ReviewProcess;
  };
  /** contentDistribution 的描述 */
  contentDistribution: {
    smartPush: PushStrategy;
    peakTimePosting: PostingSchedule;
    crossPlatform: PlatformSync;
  };
  /** qualityControl 的描述 */
  qualityControl: QualityMetrics;
  /** performanceTracking 的描述 */
  performanceTracking: IPerformanceMetrics;
}

// 社群分析
export interface ICommunityAnalytics {
  /** engagementMetrics 的描述 */
  engagementMetrics: {
    activeUsers: UserMetrics;
    interactionRate: InteractionMetrics;
    contentPerformance: IPerformanceMetrics;
  };
  /** userBehavior 的描述 */
  userBehavior: {
    interestTracking: InterestMetrics;
    participationPatterns: ParticipationMetrics;
    influenceAnalysis: InfluenceMetrics;
  };
  /** trendAnalysis 的描述 */
  trendAnalysis: TrendMetrics;
  /** insightGeneration 的描述 */
  insightGeneration: InsightReport;
}

// 运营工具
export interface IOperationTools {
  /** automationTools 的描述 */
  automationTools: {
    contentScheduling: SchedulingSystem;
    notificationSystem: NotificationConfig;
    dataCollection: DataCollector;
    reportGeneration: ReportGenerator;
  };
  /** managementDashboard 的描述 */
  managementDashboard: {
    overviewMetrics: MetricsDashboard;
    taskManagement: TaskSystem;
    resourceAllocation: ResourceManager;
  };
  /** operationReports 的描述 */
  operationReports: OperationReport[];
  /** efficiencyMetrics 的描述 */
  efficiencyMetrics: EfficiencyMetric[];
}

// 用户关系
export interface IUserRelations {
  /** userSegmentation 的描述 */
  userSegmentation: {
    behaviorGroups: BehaviorGroup;
    interestClusters: InterestCluster;
    engagementLevels: EngagementLevel;
  };
  /** communicationSystem 的描述 */
  communicationSystem: {
    targetedMessages: MessageSystem;
    feedbackCollection: FeedbackSystem;
    userSupport: SupportSystem;
  };
  /** relationshipMetrics 的描述 */
  relationshipMetrics: RelationshipMetric[];
  /** satisfactionTracking 的描述 */
  satisfactionTracking: SatisfactionMetric[];
}
