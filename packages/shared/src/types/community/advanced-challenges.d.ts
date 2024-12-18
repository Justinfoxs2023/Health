/**
 * @fileoverview TS 文件 advanced-challenges.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 季节性挑战
export interface ISeasonalChallenges {
  /** activeChallenges 的描述 */
  activeChallenges: ISeasonalChallenge[];
  /** seasonalPhases 的描述 */
  seasonalPhases: Phase[];
  /** specialEvents 的描述 */
  specialEvents: Event[];
  /** leaderboards 的描述 */
  leaderboards: Leaderboard[];
  /** rewards 的描述 */
  rewards: SeasonalReward[];
}

// 智能匹配系统
export interface IMatchingSystem {
  /** matchedPartners 的描述 */
  matchedPartners: Partner[];
  /** compatibilityScores 的描述 */
  compatibilityScores: CompatibilityScore[];
  /** recommendedGroups 的描述 */
  recommendedGroups: Group[];
  /** matchingHistory 的描述 */
  matchingHistory: MatchHistory[];
  /** futureMatches 的描述 */
  futureMatches: PredictedMatch[];
}

// 高级奖励系统
export interface IAdvancedRewards {
  /** compoundRewards 的描述 */
  compoundRewards: ICompoundReward[];
  /** rareRewards 的描述 */
  rareRewards: RareReward[];
  /** achievementChains 的描述 */
  achievementChains: AchievementChain[];
  /** specialUnlocks 的描述 */
  specialUnlocks: SpecialUnlock[];
  /** rewardProjections 的描述 */
  rewardProjections: RewardProjection[];
}

// 社交增强
export interface ISocialEnhancement {
  /** interactionEvents 的描述 */
  interactionEvents: InteractionEvent[];
  /** socialChallenges 的描述 */
  socialChallenges: SocialChallenge[];
  /** teamActivities 的描述 */
  teamActivities: TeamActivity[];
  /** communityProjects 的描述 */
  communityProjects: Project[];
  /** collaborationOpportunities 的描述 */
  collaborationOpportunities: Opportunity[];
}

// 季节性挑战详情
export interface ISeasonalChallenge {
  /** id 的描述 */
  id: string;
  /** season 的描述 */
  season: Season;
  /** theme 的描述 */
  theme: Theme;
  /** phases 的描述 */
  phases: Phase[];
  /** specialRewards 的描述 */
  specialRewards: SeasonalReward[];
  /** leaderboard 的描述 */
  leaderboard: Leaderboard;
}

// 智能匹配详情
export interface ISmartMatch {
  /** userId 的描述 */
  userId: string;
  /** partnerType 的描述 */
  partnerType: PartnerType;
  /** compatibilityScore 的描述 */
  compatibilityScore: number;
  /** matchingCriteria 的描述 */
  matchingCriteria: Criteria[];
  /** activityPreferences 的描述 */
  activityPreferences: Preference[];
}

// 复合奖励
export interface ICompoundReward {
  /** id 的描述 */
  id: string;
  /** components 的描述 */
  components: Reward[];
  /** multiplier 的描述 */
  multiplier: number;
  /** conditions 的描述 */
  conditions: Condition[];
  /** expiryDate 的描述 */
  expiryDate: Date;
}

// 互动事件
export interface InteractionEvent {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: EventType;
  /** participants 的描述 */
  participants: Participant[];
  /** activities 的描述 */
  activities: Activity[];
  /** rewards 的描述 */
  rewards: SocialReward[];
}
