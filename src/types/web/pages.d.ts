// 页面配置类型
export interface PageConfig {
  layout: 'default' | 'wide' | 'custom';
  theme: ThemeConfig;
  components: ComponentConfig[];
  permissions: PagePermission[];
  seo: SEOConfig;
}

// 个人主页配置
export interface ProfilePageConfig extends PageConfig {
  sections: {
    header: ProfileHeaderConfig;
    overview: HealthOverviewConfig;
    stats: StatsConfig;
    activities: ActivityFeedConfig;
    goals: GoalsConfig;
    achievements: AchievementsConfig;
  };
  customization: {
    visibleSections: string[];
    order: string[];
    style: CustomStyleConfig;
  };
}

// 团队主页配置
export interface TeamPageConfig extends PageConfig {
  sections: {
    header: TeamHeaderConfig;
    members: TeamMembersConfig;
    performance: TeamPerformanceConfig;
    challenges: TeamChallengesConfig;
    leaderboard: LeaderboardConfig;
    events: TeamEventsConfig;
  };
  collaboration: {
    chat: ChatConfig;
    sharing: SharingConfig;
    notifications: NotificationConfig;
  };
} 