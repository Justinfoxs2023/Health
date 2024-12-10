// 实时互动
export interface RealTimeInteractions {
  liveActivities: {
    groupExercise: LiveSession;
    healthConsultation: Consultation;
    communityDiscussion: Discussion;
    expertQA: QASession;
  };
  interactionFeatures: {
    voiceChat: VoiceChat;
    videoStreaming: VideoStream;
    instantMessaging: Messaging;
    screenSharing: ScreenShare;
  };
  participantMetrics: EngagementMetric[];
  interactionQuality: QualityMetric[];
}

// AI社交推荐
export interface AISocialRecommendations {
  personalizedMatching: {
    interestGroups: Group[];
    activityPartners: Partner[];
    mentorMatching: Mentor[];
    teamFormation: Team[];
  };
  contentRecommendations: {
    healthContent: Content[];
    learningResources: Resource[];
    communityPosts: Post[];
    expertAdvice: Advice[];
  };
  interactionSuggestions: Suggestion[];
  engagementOptimization: OptimizationStrategy;
}

// 高级评估
export interface AdvancedEvaluation {
  comprehensiveMetrics: {
    participationQuality: QualityMetric;
    interactionEffectiveness: EffectivenessMetric;
    learningProgress: ProgressMetric;
    communityContribution: ContributionMetric;
  };
  performanceAnalytics: {
    trendsAnalysis: Trend[];
    benchmarkComparison: Benchmark[];
    predictiveInsights: Prediction[];
  };
  feedbackSystem: FeedbackSystem;
  improvementSuggestions: Suggestion[];
}

// 社交网络增强
export interface SocialNetworkEnhancement {
  networkExpansion: {
    connectionSuggestions: Connection[];
    groupRecommendations: Group[];
    eventInvitations: Invitation[];
    collaborationOpportunities: Opportunity[];
  };
  interactionEnhancement: {
    socialActivities: Activity[];
    communityProjects: Project[];
    mentorshipPrograms: Program[];
  };
  networkAnalytics: NetworkMetric[];
  engagementStrategies: Strategy[];
} 