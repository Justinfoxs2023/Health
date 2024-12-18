/**
 * @fileoverview TS 文件 base.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户角色
export type UserRoleType = any;

// 参与类型
export type ParticipationType = any;

// 参与场景
export interface IParticipationContext {
  /** type 的描述 */
    type: "personal" | "family" | "social";
  /** scope 的描述 */
    scope: {
    personal: {
      userId: string;
      preferences: IUserPreferences;
    };
    family?: {
      familyId: string;
      role: FamilyRoleType;
      members: string[];
    };
    social?: {
      groupId: string;
      role: GroupRoleType;
      memberCount: number;
    };
  };
}

// 用户偏好设置
export interface IUserPreferences {
  /** privacyLevel 的描述 */
    privacyLevel: public  friends  private;
  notificationSettings: {
    achievements: boolean;
    levelUp: boolean;
    challenges: boolean;
  };
  displaySettings: {
    showRank: boolean;
    showAchievements: boolean;
    showProgress: boolean;
  };
}

// 家庭角色
export type FamilyRoleType =
  any; // 普通成员

// 群组角色
export type GroupRoleType =
  any; // 普通成员

// 用户游戏配置
export interface IUserGameProfile {
  /** userId 的描述 */
    userId: string;
  /** role 的描述 */
    role: "user" | "expert" | "merchant" | "admin";
  /** level 的描述 */
    level: number;
  /** experience 的描述 */
    experience: number;
  /** nextLevelExp 的描述 */
    nextLevelExp: number;
  /** achievements 的描述 */
    achievements: string;
  /** features 的描述 */
    features: string;
  /** activities 的描述 */
    activities: Array{
    type: string;
    count: number;
    lastActive: Date;
  }>;
  specializations: Specialization[];
  preferences: {
    learningPath: string[];
    focusAreas: string[];
  };
}

// 基础类型定义
export type ModuleType =
  any;

export type FeatureDepthType = any;

// 等级系统接口
export interface ILevelSystem {
  /** currentLevel 的描述 */
    currentLevel: {
    level: number;
    title: string;
    featureUnlocks: IFeatureUnlock;
    masteryBonuses: IMasteryBonus;
    specialPrivileges: {
      maxProducts: number;
      maxShowcaseSlots: number;
    };
  };
  /** experience 的描述 */
    experience: number;
  /** nextLevelExp 的描述 */
    nextLevelExp: number;
  /** totalExp 的描述 */
    totalExp: number;
  /** levelHistory 的描述 */
    levelHistory: ILevelProgress[];
  /** unlockedFeatures 的描述 */
    unlockedFeatures: string[];
  /** masteryPoints 的描述 */
    masteryPoints: number;
  /** specializations 的描述 */
    specializations: ISpecialization[];
  /** unlockedModules 的描述 */
    unlockedModules: ModuleType[];
}

// 功能解锁接口
export interface IFeatureUnlock {
  /** featureId 的描述 */
    featureId: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** requirements 的描述 */
    requirements: {
    level: number;
    prerequisites: string;
  };
}

// 专精系统接口
export interface ISpecialization {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** level 的描述 */
    level: number;
  /** progress 的描述 */
    progress: number;
  /** maxLevel 的描述 */
    maxLevel: number;
  /** benefits 的描述 */
    benefits: {
    type: string;
    value: number;
    unlockLevel: number;
  }[];
}

// 等级进度接口
export interface ILevelProgress {
  /** level 的描述 */
    level: number;
  /** achievedAt 的描述 */
    achievedAt: Date;
  /** expGained 的描述 */
    expGained: number;
  /** unlockedFeatures 的描述 */
    unlockedFeatures: string;
  /** achievements 的描述 */
    achievements: string;
}

// 精通加成接口
export interface IMasteryBonus {
  /** type 的描述 */
    type: exp_boost  reward_boost  skill_boost;
  value: number;
  unlockLevel: number;
}

// 需要补充缺失的类型导出
export interface IEnhancedLevelSystem extends ILevelSystem {
  /** currentLevel 的描述 */
    currentLevel: {
    level: number;
    title: string;
    featureUnlocks: IFeatureUnlock[];
    masteryBonuses: IMasteryBonus[];
    specialPrivileges?: {
      maxProducts?: number;
      maxShowcaseSlots?: number;
    };
  };
  /** experience 的描述 */
    experience: number;
  /** nextLevelExp 的描述 */
    nextLevelExp: number;
  /** totalExp 的描述 */
    totalExp: number;
  /** levelHistory 的描述 */
    levelHistory: ILevelProgress[];
  /** unlockedFeatures 的描述 */
    unlockedFeatures: string[];
  /** masteryPoints 的描述 */
    masteryPoints: number;
  /** specializations 的描述 */
    specializations: ISpecialization[];
  /** unlockedModules 的描述 */
    unlockedModules: ModuleType[];
}

export interface IBaseGameEntity {
  /** id 的描述 */
    id: string;
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
}

export interface IBaseAchievement extends IBaseGameEntity {
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** unlocked 的描述 */
    unlocked: false | true;
  /** unlockedAt 的描述 */
    unlockedAt?: undefined | Date;
}

export interface IBaseProgress extends IBaseGameEntity {
  /** userId 的描述 */
    userId: string;
  /** currentLevel 的描述 */
    currentLevel: number;
  /** experience 的描述 */
    experience: number;
  /** achievements 的描述 */
    achievements: string[];
}

export interface IBaseFeature extends IBaseGameEntity {
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: string;
  /** enabled 的描述 */
    enabled: false | true;
  /** config 的描述 */
    config?: undefined | Record<string, any>;
}
