/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '@app/gamification' {
  export interface UserLevel {
    level: number;
    exp: number;
    nextLevelExp: number;
    title: string;
    featureUnlocks: FeatureUnlock;
    masteryBonuses: MasteryBonus;
  }

  export interface LevelSystem {
    currentLevel: UserLevel;
    experience: number;
    nextLevelExp: number;
    totalExp: number;
    levelHistory: LevelProgress;
    unlockedFeatures: string;
    masteryPoints: number;
    specializations: Specialization;
    unlockedModules: ModuleType;
  }

  export type ModuleType =
    | 'health_tracking'
    | 'exercise'
    | 'diet'
    | 'social'
    | 'expert_consult'
    | 'family_health'
    | 'data_analysis'
    | 'premium_content';

  export type FeatureDepth = 'basic' | 'advanced' | 'expert';
}
