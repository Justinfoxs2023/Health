/**
 * @fileoverview TS 文件 advanced-activities.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 季节性活动
export interface ISeasonalActivities {
  /** thematicChallenges 的描述 */
  thematicChallenges: {
    seasonalDiet: Challenge;
    seasonalExercise: Challenge;
    seasonalWellness: Challenge;
    traditionalPractices: Challenge;
  };
  /** communityEvents 的描述 */
  communityEvents: {
    seasonalGatherings: Event[];
    culturalCelebrations: Event[];
    outdoorActivities: Event[];
  };
  /** seasonalRewards 的描述 */
  seasonalRewards: Reward[];
  /** participationTracking 的描述 */
  participationTracking: ParticipationMetric[];
}

// 互动式学习
export interface InteractiveLearning {
  /** learningActivities 的描述 */
  learningActivities: {
    virtualWorkshops: Workshop;
    practicalDemos: Demonstration;
    groupDiscussions: Discussion;
    peerLearning: PeerSession;
  };
  /** assessmentSystem 的描述 */
  assessmentSystem: {
    skillEvaluation: Evaluation[];
    progressTracking: ProgressMetric[];
    certificationPath: CertificationPath;
  };
  /** learningRewards 的描述 */
  learningRewards: Reward[];
  /** communityContributions 的描述 */
  communityContributions: Contribution[];
}

// 社交竞赛
export interface ISocialCompetitions {
  /** teamChallenges 的描述 */
  teamChallenges: {
    groupFitness: Challenge;
    healthyLifestyle: Challenge;
    communityService: Challenge;
    innovationProjects: Challenge;
  };
  /** competitionMechanics 的描述 */
  competitionMechanics: {
    rankingSystem: RankingSystem;
    teamFormation: TeamFormation;
    progressTracking: ProgressMetric[];
  };
  /** rewardSystem 的描述 */
  rewardSystem: RewardSystem;
  /** socialInteractions 的描述 */
  socialInteractions: InteractionMetric[];
}

// 个性化活动
export interface IPersonalizedActivities {
  /** recommendedActivities 的描述 */
  recommendedActivities: {
    personalChallenges: Challenge;
    groupActivities: Activity;
    learningPaths: LearningPath;
    wellnessPrograms: Program;
  };
  /** adaptiveSystem 的描述 */
  adaptiveSystem: {
    difficultyAdjustment: DifficultyLevel;
    goalAlignment: GoalAlignment;
    progressAdaptation: AdaptationMetric;
  };
  /** personalizedRewards 的描述 */
  personalizedRewards: Reward[];
  /** engagementMetrics 的描述 */
  engagementMetrics: EngagementMetric[];
}
