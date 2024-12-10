// 季节性活动
export interface SeasonalActivities {
  thematicChallenges: {
    seasonalDiet: Challenge;
    seasonalExercise: Challenge;
    seasonalWellness: Challenge;
    traditionalPractices: Challenge;
  };
  communityEvents: {
    seasonalGatherings: Event[];
    culturalCelebrations: Event[];
    outdoorActivities: Event[];
  };
  seasonalRewards: Reward[];
  participationTracking: ParticipationMetric[];
}

// 互动式学习
export interface InteractiveLearning {
  learningActivities: {
    virtualWorkshops: Workshop[];
    practicalDemos: Demonstration[];
    groupDiscussions: Discussion[];
    peerLearning: PeerSession[];
  };
  assessmentSystem: {
    skillEvaluation: Evaluation[];
    progressTracking: ProgressMetric[];
    certificationPath: CertificationPath;
  };
  learningRewards: Reward[];
  communityContributions: Contribution[];
}

// 社交竞赛
export interface SocialCompetitions {
  teamChallenges: {
    groupFitness: Challenge;
    healthyLifestyle: Challenge;
    communityService: Challenge;
    innovationProjects: Challenge;
  };
  competitionMechanics: {
    rankingSystem: RankingSystem;
    teamFormation: TeamFormation;
    progressTracking: ProgressMetric[];
  };
  rewardSystem: RewardSystem;
  socialInteractions: InteractionMetric[];
}

// 个性化活动
export interface PersonalizedActivities {
  recommendedActivities: {
    personalChallenges: Challenge[];
    groupActivities: Activity[];
    learningPaths: LearningPath[];
    wellnessPrograms: Program[];
  };
  adaptiveSystem: {
    difficultyAdjustment: DifficultyLevel;
    goalAlignment: GoalAlignment;
    progressAdaptation: AdaptationMetric;
  };
  personalizedRewards: Reward[];
  engagementMetrics: EngagementMetric[];
} 