/**
 * @fileoverview TS 文件 seasonal-content.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 季节性主题内容
export interface ISeasonalThemeContent {
  /** mainTheme 的描述 */
  mainTheme: ITheme;
  /** seasonalActivities 的描述 */
  seasonalActivities: Activity;
  /** specialChallenges 的描述 */
  specialChallenges: Challenge;
  /** themeRewards 的描述 */
  themeRewards: ThemeReward;
  /** seasonalDecorations 的描述 */
  seasonalDecorations: Decoration;
}

// 节日活动
export interface IFestivalEvents {
  /** festivalTheme 的描述 */
  festivalTheme: ITheme;
  /** specialEvents 的描述 */
  specialEvents: Event;
  /** festivalRewards 的描述 */
  festivalRewards: IFestivalReward;
  /** communityActivities 的描述 */
  communityActivities: Activity;
  /** limitedTimeOffers 的描述 */
  limitedTimeOffers: Offer;
}

// 季节性排行榜
export interface ISeasonalLeaderboards {
  /** activeLeaderboards 的描述 */
  activeLeaderboards: Leaderboard;
  /** rankingRules 的描述 */
  rankingRules: Rule;
  /** seasonalRewards 的描述 */
  seasonalRewards: SeasonalReward;
  /** competitionPeriods 的描述 */
  competitionPeriods: Period;
  /** specialCategories 的描述 */
  specialCategories: Category;
}

// 季节性社区活动
export interface ISeasonalCommunityEvents {
  /** communityEvents 的描述 */
  communityEvents: Event;
  /** teamChallenges 的描述 */
  teamChallenges: Challenge;
  /** socialActivities 的描述 */
  socialActivities: Activity;
  /** seasonalProjects 的描述 */
  seasonalProjects: Project;
  /** communityRewards 的描述 */
  communityRewards: Reward;
}

// 主题
export interface ITheme {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** seasonalFeatures 的描述 */
  seasonalFeatures: Feature;
  /** visualAssets 的描述 */
  visualAssets: Asset;
}

// 节日奖励
export interface IFestivalReward {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: RewardType;
  /** rarity 的描述 */
  rarity: Rarity;
  /** validityPeriod 的描述 */
  validityPeriod: Period;
  /** unlockConditions 的描述 */
  unlockConditions: Condition;
}

// 社区活动
export interface ICommunityEvent {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: EventType;
  /** theme 的描述 */
  theme: ITheme;
  /** duration 的描述 */
  duration: Period;
  /** participants 的描述 */
  participants: Participant;
  /** rewards 的描述 */
  rewards: Reward;
}
