/**
 * @fileoverview TS 文件 level-progression.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 等级阶段配置
export interface ILevelStageConfig {
  /** maxDays 的描述 */
    maxDays: number;
  /** dailyExp 的描述 */
    dailyExp: {
    min: number;
    normal: number;
    max: number;
  };
  /** keyFeatures 的描述 */
    keyFeatures: string[];
  /** requirements 的描述 */
    requirements: {
    [key: string]: number;
  };
}

// 等级进度配置
export interface ILevelProgressionConfig {
  /** novice 的描述 */
    novice: ILevelStageConfig;  
  /** growth 的描述 */
    growth: ILevelStageConfig;  
  /** advanced 的描述 */
    advanced: ILevelStageConfig;  
  /** expert 的描述 */
    expert: ILevelStageConfig;  
  /** master 的描述 */
    master: ILevelStageConfig;  
}

// 加速机制配置
export interface IProgressionBoosters {
  /** dailyBoosters 的描述 */
    dailyBoosters: {
    key: string: number;
  };
  /** achievementBoosters 的描述 */
    achievementBoosters: {
    [key: string]: number;
  };
  /** socialBoosters 的描述 */
    socialBoosters: {
    [key: string]: number;
  };
}
