/**
 * @fileoverview TS 文件 level-system.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 等级系统配置
export interface ILevelSystemConfig {
  /** expConfig 的描述 */
  expConfig: {
    baseExp: number;
    expGrowthRate: number;
    maxLevel: number;
  };

  // 等级特权配置
  /** levelPrivileges 的描述 */
  levelPrivileges: Record<
    number,
    {
      features: string[];
      questLines: string[];
      rewards: {
        items: string[];
        points: number;
        titles?: string[];
      };
      interfaceElements: string[];
    }
  >;

  // 参与度要求
  /** participationRequirements 的描述 */
  participationRequirements: {
    dailyTasks: number;
    weeklyGoals: number;
    socialInteractions: number;
    contentCreation: number;
  };
}

// 等级进度
export interface ILevelProgress {
  /** currentLevel 的描述 */
  currentLevel: number;
  /** currentExp 的描述 */
  currentExp: number;
  /** nextLevelExp 的描述 */
  nextLevelExp: number;
  /** progressPercentage 的描述 */
  progressPercentage: number;
  /** recentActivities 的描述 */
  recentActivities: {
    timestamp: number;
    activity: string;
    expGained: number;
  }[];
  /** unlockedFeatures 的描述 */
  unlockedFeatures: string[];
  /** pendingRewards 的描述 */
  pendingRewards: {
    type: string;
    value: string | number;
    claimStatus: 'available' | 'claimed' | 'expired';
  }[];
}
