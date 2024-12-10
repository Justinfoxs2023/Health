// 季节性挑战
export interface SeasonalChallenges {
  activeChallenges: SeasonalChallenge[];
  seasonalPhases: Phase[];
  specialEvents: Event[];
  leaderboards: Leaderboard[];
  rewards: SeasonalReward[];
}

// 智能匹配系统
export interface MatchingSystem {
  matchedPartners: Partner[];
  compatibilityScores: CompatibilityScore[];
  recommendedGroups: Group[];
  matchingHistory: MatchHistory[];
  futureMatches: PredictedMatch[];
}

// 高级奖励系统
export interface AdvancedRewards {
  compoundRewards: CompoundReward[];
  rareRewards: RareReward[];
  achievementChains: AchievementChain[];
  specialUnlocks: SpecialUnlock[];
  rewardProjections: RewardProjection[];
}

// 社交增强
export interface SocialEnhancement {
  interactionEvents: InteractionEvent[];
  socialChallenges: SocialChallenge[];
  teamActivities: TeamActivity[];
  communityProjects: Project[];
  collaborationOpportunities: Opportunity[];
}

// 季节性挑战详情
export interface SeasonalChallenge {
  id: string;
  season: Season;
  theme: Theme;
  phases: Phase[];
  specialRewards: SeasonalReward[];
  leaderboard: Leaderboard;
}

// 智能匹配详情
export interface SmartMatch {
  userId: string;
  partnerType: PartnerType;
  compatibilityScore: number;
  matchingCriteria: Criteria[];
  activityPreferences: Preference[];
}

// 复合奖励
export interface CompoundReward {
  id: string;
  components: Reward[];
  multiplier: number;
  conditions: Condition[];
  expiryDate: Date;
}

// 互动事件
export interface InteractionEvent {
  id: string;
  type: EventType;
  participants: Participant[];
  activities: Activity[];
  rewards: SocialReward[];
} 