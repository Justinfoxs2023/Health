// 季节性主题内容
export interface SeasonalThemeContent {
  mainTheme: Theme;
  seasonalActivities: Activity[];
  specialChallenges: Challenge[];
  themeRewards: ThemeReward[];
  seasonalDecorations: Decoration[];
}

// 节日活动
export interface FestivalEvents {
  festivalTheme: Theme;
  specialEvents: Event[];
  festivalRewards: FestivalReward[];
  communityActivities: Activity[];
  limitedTimeOffers: Offer[];
}

// 季节性排行榜
export interface SeasonalLeaderboards {
  activeLeaderboards: Leaderboard[];
  rankingRules: Rule[];
  seasonalRewards: SeasonalReward[];
  competitionPeriods: Period[];
  specialCategories: Category[];
}

// 季节性社区活动
export interface SeasonalCommunityEvents {
  communityEvents: Event[];
  teamChallenges: Challenge[];
  socialActivities: Activity[];
  seasonalProjects: Project[];
  communityRewards: Reward[];
}

// 主题
export interface Theme {
  id: string;
  name: string;
  description: string;
  seasonalFeatures: Feature[];
  visualAssets: Asset[];
}

// 节日奖励
export interface FestivalReward {
  id: string;
  type: RewardType;
  rarity: Rarity;
  validityPeriod: Period;
  unlockConditions: Condition[];
}

// 社区活动
export interface CommunityEvent {
  id: string;
  type: EventType;
  theme: Theme;
  duration: Period;
  participants: Participant[];
  rewards: Reward[];
} 