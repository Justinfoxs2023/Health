/**
 * @fileoverview TS 文件 festival-theme.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 传统节日
export interface ITraditionalFestivals {
  /** festivals 的描述 */
  festivals: IFestival;
  /** culturalEvents 的描述 */
  culturalEvents: CulturalEvent;
  /** communityTraditions 的描述 */
  communityTraditions: Tradition;
}

// 健康主题活动
export interface IHealthThemeEvents {
  /** healthThemes 的描述 */
  healthThemes: IHealthTheme;
  /** communityPrograms 的描述 */
  communityPrograms: Program;
  /** expertGuidance 的描述 */
  expertGuidance: Guidance;
}

// 社区主题活动
export interface ICommunityThemeEvents {
  /** communityThemes 的描述 */
  communityThemes: ICommunityTheme;
  /** socialEvents 的描述 */
  socialEvents: SocialEvent;
  /** collaborativeProjects 的描述 */
  collaborativeProjects: Project;
}

// 主题参与度
export interface IThemeEngagement {
  /** participationMetrics 的描述 */
  participationMetrics: ParticipationMetric;
  /** interactionQuality 的描述 */
  interactionQuality: QualityMetric;
  /** userFeedback 的描述 */
  userFeedback: Feedback;
  /** engagementTrends 的描述 */
  engagementTrends: Trend;
  /** improvementSuggestions 的描述 */
  improvementSuggestions: Suggestion;
}

// 节日详情
export interface IFestival {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** culturalElements 的描述 */
  culturalElements: CulturalElement;
  /** traditions 的描述 */
  traditions: Tradition;
  /** activities 的描述 */
  activities: Activity;
  /** culturalContent 的描述 */
  culturalContent: Content;
  /** specialCeremonies 的描述 */
  specialCeremonies: Ceremony;
  /** traditionalRewards 的描述 */
  traditionalRewards: Reward;
}

// 健康主题
export interface IHealthTheme {
  /** id 的描述 */
  id: string;
  /** focus 的描述 */
  focus: HealthFocus;
  /** targetGroups 的描述 */
  targetGroups: TargetGroup;
  /** activities 的描述 */
  activities: Activity;
  /** healthGuidance 的描述 */
  healthGuidance: Guidance;
  /** groupActivities 的描述 */
  groupActivities: GroupActivity;
  /** wellnessRewards 的描述 */
  wellnessRewards: Reward;
}

// 社区主题
export interface ICommunityTheme {
  /** id 的描述 */
  id: string;
  /** participationTypes 的描述 */
  participationTypes: ParticipationType;
  /** interactionModes 的描述 */
  interactionModes: InteractionMode;
  /** activities 的描述 */
  activities: Activity;
  /** groupChallenges 的描述 */
  groupChallenges: Challenge;
  /** teamProjects 的描述 */
  teamProjects: Project;
  /** communityRewards 的描述 */
  communityRewards: Reward;
}
