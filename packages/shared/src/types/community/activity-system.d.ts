/**
 * @fileoverview TS 文件 activity-system.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 日常挑战
export interface IDailyChallenges {
  /** activePrograms 的描述 */
  activePrograms: {
    morningRoutine: Challenge;
    exerciseTracking: Challenge;
    healthyDiet: Challenge;
    mindfulPractice: Challenge;
  };
  /** participationStats 的描述 */
  participationStats: ParticipationStats;
  /** rewardHistory 的描述 */
  rewardHistory: Reward[];
  /** streakProgress 的描述 */
  streakProgress: StreakMetric[];
}

// 周期活动
export interface IWeeklyEvents {
  /** discussionForums 的描述 */
  discussionForums: {
    healthTopics: Discussion;
    expertQA: QASession;
    communitySharing: SharingSession;
  };
  /** participationRecords 的描述 */
  participationRecords: ParticipationRecord[];
  /** interactionMetrics 的描述 */
  interactionMetrics: InteractionMetric[];
  /** contentContributions 的描述 */
  contentContributions: Contribution[];
}

// 月度活动
export interface IMonthlyCampaigns {
  /** talentPrograms 的描述 */
  talentPrograms: {
    healthExpertSelection: TalentProgram;
    transformationPlan: TransformationProgram;
  };
  /** campaignMetrics 的描述 */
  campaignMetrics: CampaignMetric[];
  /** participantProgress 的描述 */
  participantProgress: ProgressRecord[];
  /** achievementRecords 的描述 */
  achievementRecords: Achievement[];
}

// 特别活动
export interface ISpecialEvents {
  /** offlineEvents 的描述 */
  offlineEvents: {
    healthLectures: Lecture[];
    sportsCompetitions: Competition[];
    foodTasting: TastingEvent[];
  };
  /** onlineFestivals 的描述 */
  onlineFestivals: {
    annualCelebration: Festival;
    quarterlyShowcase: Showcase;
    healthStreamingWeek: StreamingEvent;
  };
  /** eventParticipation 的描述 */
  eventParticipation: ParticipationMetric[];
  /** eventFeedback 的描述 */
  eventFeedback: Feedback[];
}
