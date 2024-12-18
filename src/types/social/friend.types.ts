/**
 * @fileoverview TS 文件 friend.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 好友关系状态
export type FriendshipStatusType =
  any; // 已屏蔽

// 好友请求配置
export interface IFriendRequest {
  /** id 的描述 */
  id: string;
  /** fromUserId 的描述 */
  fromUserId: string;
  /** toUserId 的描述 */
  toUserId: string;
  /** message 的描述 */
  message: string;
  /** status 的描述 */
  status: "pending" | "accepted" | "rejected" | "blocked";
  /** createdAt 的描述 */
  createdAt: Date;

  /** visibility 的描述 */
  visibility: {
    healthData: boolean;
    achievements: boolean;
    activities: boolean;
    socialPosts: boolean;
  };
  // 时效性设置
  /** duration 的描述 */
  duration?: undefined | { startDate: Date; endDate?: Date | undefined; };
}

// 个人页面配置
export interface IProfileConfig {
  /** userId 的描述 */
  userId: string;

  /** basicInfo 的描述 */
  basicInfo: {
    nickname: boolean;
    avatar: boolean;
    level: boolean;
    title: boolean;
    badges: boolean;
  };
  // 成就展示
  /** achievements 的描述 */
  achievements: {
    showAll: boolean;
    selectedIds: string[]; // 选择展示的成就ID
    hideProgress: boolean; // 是否隐藏进度
  };
  // 活动记录
  /** activities 的描述 */
  activities: {
    showTypes: string[]; // 展示的活���类型
    timeRange: number; // 展示时间范围(天)
    maxItems: number; // 最大展示条数
  };
  // 社交展示
  /** social 的描述 */
  social: {
    showFriends: boolean;
    showGroups: boolean;
    showPosts: boolean;
    showComments: boolean;
  };
  // 健康数据
  /** healthData 的描述 */
  healthData: {
    metrics: string[]; // 可见的健康指标
    showTrends: boolean; // 是否显示趋势
    aggregateOnly: boolean; // 仅显示汇总数据
  };
}
