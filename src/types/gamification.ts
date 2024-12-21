/**
 * @fileoverview TS 文件 gamification.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 导出所有游戏化相关类型
export * from './gamification/activity.types';
export * from './gamification/ai-task.types';
export * from './gamification/level-task.types';
export * from './gamification/achievement.types';
export * from './gamification/interface.types';
export * from './gamification/tutorial.types';
export * from './gamification/trading.types';

// 基础类型定义
export interface IUserLevel {
  /** id 的描述 */
    id: string;
  /** level 的描述 */
    level: number;
  /** experience 的描述 */
    experience: number;
  /** nextLevelExp 的描述 */
    nextLevelExp: number;
  /** achievements 的描述 */
    achievements: string;
}

export interface IGameProgress {
  /** userId 的描述 */
    userId: string;
  /** currentLevel 的描述 */
    currentLevel: number;
  /** totalPoints 的描述 */
    totalPoints: number;
  /** achievements 的描述 */
    achievements: IAchievement;
}

export interface IAchievement {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** unlocked 的描述 */
    unlocked: false | true;
  /** unlockedAt 的描述 */
    unlockedAt: Date;
}

export interface ILevelSystem {
  /** currentLevel 的描述 */
    currentLevel: number;
  /** totalExp 的描述 */
    totalExp: number;
  /** achievements 的描述 */
    achievements: string;
  /** activeTime 的描述 */
    activeTime: number;
}

export interface ISpecialization {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** level 的描述 */
    level: number;
  /** progress 的描述 */
    progress: number;
}

export interface IFeatureDepth {
  /** id 的描述 */
    id: string;
  /** level 的描述 */
    level: number;
  /** features 的描述 */
    features: string;
}

export interface IFeatureTier {
  /** depth 的描述 */
    depth: string;
  /** minLevel 的描述 */
    minLevel: number;
  /** features 的描述 */
    features: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** requirements 的描述 */
    requirements: {
    points: number;
    achievements: string;
    activeTime: number;
  };
}

export interface IFeatureUnlock {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: string;
}

export interface IChallenge {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: string;
  /** status 的描述 */
    status: active  /** completed 的描述 */
    /** completed 的描述 */
    completed;
}

export type ParticipationType = 
  any;

export interface IUserGameProfile {
  /** userId 的描述 */
    userId: string;
  /** role 的描述 */
    role: string;
  /** level 的描述 */
    level: number;
  /** experience 的描述 */
    experience: number;
  /** achievements 的描述 */
    achievements: string;
}
  </rewritten_file>