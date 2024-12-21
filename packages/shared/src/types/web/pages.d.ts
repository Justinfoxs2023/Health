/**
 * @fileoverview TS 文件 pages.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 页面配置类型
export interface IPageConfig {
  /** layout 的描述 */
  layout: 'default' | 'wide' | 'custom';
  /** theme 的描述 */
  theme: ThemeConfig;
  /** components 的描述 */
  components: ComponentConfig[];
  /** permissions 的描述 */
  permissions: PagePermission[];
  /** seo 的描述 */
  seo: SEOConfig;
}

// 个人主页配置
export interface IProfilePageConfig extends IPageConfig {
  /** sections 的描述 */
  sections: {
    header: ProfileHeaderConfig;
    overview: HealthOverviewConfig;
    stats: StatsConfig;
    activities: ActivityFeedConfig;
    goals: GoalsConfig;
    achievements: AchievementsConfig;
  };
  /** customization 的描述 */
  customization: {
    visibleSections: string[];
    order: string[];
    style: CustomStyleConfig;
  };
}

// 团队主页配置
export interface ITeamPageConfig extends IPageConfig {
  /** sections 的描述 */
  sections: {
    header: TeamHeaderConfig;
    members: TeamMembersConfig;
    performance: TeamPerformanceConfig;
    challenges: TeamChallengesConfig;
    leaderboard: LeaderboardConfig;
    events: TeamEventsConfig;
  };
  /** collaboration 的描述 */
  collaboration: {
    chat: ChatConfig;
    sharing: SharingConfig;
    notifications: NotificationConfig;
  };
}
