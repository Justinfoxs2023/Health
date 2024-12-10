// 日常挑战
export interface DailyChallenges {
  activePrograms: {
    morningRoutine: Challenge;
    exerciseTracking: Challenge;
    healthyDiet: Challenge;
    mindfulPractice: Challenge;
  };
  participationStats: ParticipationStats;
  rewardHistory: Reward[];
  streakProgress: StreakMetric[];
}

// 周期活动
export interface WeeklyEvents {
  discussionForums: {
    healthTopics: Discussion;
    expertQA: QASession;
    communitySharing: SharingSession;
  };
  participationRecords: ParticipationRecord[];
  interactionMetrics: InteractionMetric[];
  contentContributions: Contribution[];
}

// 月度活动
export interface MonthlyCampaigns {
  talentPrograms: {
    healthExpertSelection: TalentProgram;
    transformationPlan: TransformationProgram;
  };
  campaignMetrics: CampaignMetric[];
  participantProgress: ProgressRecord[];
  achievementRecords: Achievement[];
}

// 特别活动
export interface SpecialEvents {
  offlineEvents: {
    healthLectures: Lecture[];
    sportsCompetitions: Competition[];
    foodTasting: TastingEvent[];
  };
  onlineFestivals: {
    annualCelebration: Festival;
    quarterlyShowcase: Showcase;
    healthStreamingWeek: StreamingEvent;
  };
  eventParticipation: ParticipationMetric[];
  eventFeedback: Feedback[];
} 