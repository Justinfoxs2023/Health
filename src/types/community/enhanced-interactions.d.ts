/**
 * @fileoverview TS 文件 enhanced-interactions.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 实时互动
export interface IRealTimeInteractions {
  /** liveActivities 的描述 */
  liveActivities: {
    groupExercise: LiveSession;
    healthConsultation: Consultation;
    communityDiscussion: Discussion;
    expertQA: QASession;
  };
  /** interactionFeatures 的描述 */
  interactionFeatures: {
    voiceChat: VoiceChat;
    videoStreaming: VideoStream;
    instantMessaging: Messaging;
    screenSharing: ScreenShare;
  };
  /** participantMetrics 的描述 */
  participantMetrics: EngagementMetric[];
  /** interactionQuality 的描述 */
  interactionQuality: QualityMetric[];
}

// AI社交推荐
export interface IAISocialRecommendations {
  /** personalizedMatching 的描述 */
  personalizedMatching: {
    interestGroups: Group;
    activityPartners: Partner;
    mentorMatching: Mentor;
    teamFormation: Team;
  };
  /** contentRecommendations 的描述 */
  contentRecommendations: {
    healthContent: Content[];
    learningResources: Resource[];
    communityPosts: Post[];
    expertAdvice: Advice[];
  };
  /** interactionSuggestions 的描述 */
  interactionSuggestions: Suggestion[];
  /** engagementOptimization 的描述 */
  engagementOptimization: OptimizationStrategy;
}

// 高级评估
export interface IAdvancedEvaluation {
  /** comprehensiveMetrics 的描述 */
  comprehensiveMetrics: {
    participationQuality: QualityMetric;
    interactionEffectiveness: EffectivenessMetric;
    learningProgress: ProgressMetric;
    communityContribution: ContributionMetric;
  };
  /** performanceAnalytics 的描述 */
  performanceAnalytics: {
    trendsAnalysis: Trend[];
    benchmarkComparison: Benchmark[];
    predictiveInsights: Prediction[];
  };
  /** feedbackSystem 的描述 */
  feedbackSystem: FeedbackSystem;
  /** improvementSuggestions 的描述 */
  improvementSuggestions: Suggestion[];
}

// 社交网络增强
export interface ISocialNetworkEnhancement {
  /** networkExpansion 的描述 */
  networkExpansion: {
    connectionSuggestions: Connection;
    groupRecommendations: Group;
    eventInvitations: Invitation;
    collaborationOpportunities: Opportunity;
  };
  /** interactionEnhancement 的描述 */
  interactionEnhancement: {
    socialActivities: Activity[];
    communityProjects: Project[];
    mentorshipPrograms: Program[];
  };
  /** networkAnalytics 的描述 */
  networkAnalytics: NetworkMetric[];
  /** engagementStrategies 的描述 */
  engagementStrategies: Strategy[];
}
