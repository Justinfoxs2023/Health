/**
 * @fileoverview TS 文件 channel.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 频道类型
export type ChannelType =
  any; // AI客服频道

// 频道配置
export interface IChannelConfig {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: "world" | "family" | "group" | "private" | "ai_service";
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** avatar 的描述 */
  avatar: string;
  /** maxMembers 的描述 */
  maxMembers: number;
  /** features 的描述 */
  features: {
    voice: boolean;
    file: boolean;
    emoji: boolean;
    poll: boolean;
  };
  /** permissions 的描述 */
  permissions: {
    invite: string[]; // 邀请权限
    speak: string[]; // 发言权限
    manage: string[]; // 管理权限
  };
  /** gamification 的描述 */
  gamification: {
    levelRequired: number; // 进入需要等级
    rewards: {
      activeChat: number; // 活跃聊天奖励
      qualityPost: number; // 优质发言奖励
      helpOthers: number; // 帮助他人奖励
    };
  };
}
