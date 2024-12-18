/**
 * @fileoverview TS 文件 interface.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 界面区域类型
export type InterfaceZoneType =
  any; // 奖励仓库区

// 界面组件配置
export interface InterfaceComponent {
  /** id 的描述 */
  id: string;
  /** zone 的描述 */
  zone: "profile" | "quest" | "activity" | "social" | "achievement" | "reward";
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** icon 的描述 */
  icon: string;
  /** order 的描述 */
  order: number;
  /** requirements 的描述 */
  requirements: {
    level: number;
    features: string;
  };
  /** actions 的描述 */
  actions?: undefined | { onClick: string; onHover?: string | undefined; };
}

// 活跃度配置
export interface IActivityConfig {
  /** dailyTasks 的描述 */
  dailyTasks: {
    login: number;
    healthRecord: number;
    exercise: number;
    socialInteract: number;
  };
  /** weeklyTasks 的描述 */
  weeklyTasks: {
    exerciseGoal: number; // 运动目标
    healthGoal: number; // 健康目标
    communityPost: number; // 社区发帖
  };
  /** bonusActivities 的描述 */
  bonusActivities: {
    inviteFriends: number; // 邀请好友
    shareExperience: number; // 分享经验
    helpOthers: number; // 帮助他人
  };
}

// 奖励配置
export interface IRewardConfig {
  /** activityRewards 的描述 */
  activityRewards: {
    daily: {
      exp: number;
      points: number;
      items: string;
    };
    weekly: {
      exp: number;
      points: number;
      features?: string[];
    };
    monthly: {
      exp: number;
      points: number;
      titles?: string[];
    };
  };
  /** levelRewards 的描述 */
  levelRewards: Record<
    number,
    {
      exp: number;
      points: number;
      features: string[];
      titles?: string[];
    }
  >;
}
