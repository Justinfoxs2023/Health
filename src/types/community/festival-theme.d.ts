// 传统节日
export interface TraditionalFestivals {
  festivals: Festival[];
  culturalEvents: CulturalEvent[];
  communityTraditions: Tradition[];
}

// 健康主题活动
export interface HealthThemeEvents {
  healthThemes: HealthTheme[];
  communityPrograms: Program[];
  expertGuidance: Guidance[];
}

// 社区主题活动
export interface CommunityThemeEvents {
  communityThemes: CommunityTheme[];
  socialEvents: SocialEvent[];
  collaborativeProjects: Project[];
}

// 主题参与度
export interface ThemeEngagement {
  participationMetrics: ParticipationMetric[];
  interactionQuality: QualityMetric[];
  userFeedback: Feedback[];
  engagementTrends: Trend[];
  improvementSuggestions: Suggestion[];
}

// 节日详情
export interface Festival {
  id: string;
  name: string;
  culturalElements: CulturalElement[];
  traditions: Tradition[];
  activities: Activity[];
  culturalContent: Content[];
  specialCeremonies: Ceremony[];
  traditionalRewards: Reward[];
}

// 健康主题
export interface HealthTheme {
  id: string;
  focus: HealthFocus;
  targetGroups: TargetGroup[];
  activities: Activity[];
  healthGuidance: Guidance[];
  groupActivities: GroupActivity[];
  wellnessRewards: Reward[];
}

// 社区主题
export interface CommunityTheme {
  id: string;
  participationTypes: ParticipationType[];
  interactionModes: InteractionMode[];
  activities: Activity[];
  groupChallenges: Challenge[];
  teamProjects: Project[];
  communityRewards: Reward[];
} 