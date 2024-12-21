/**
 * @fileoverview TS 文件 level-task.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 等级任务类型
export type LevelTaskType =
  any; // 特殊任务

// 等级任务配置
export interface ILevelTaskConfig {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: "daily" | "weekly" | "achievement" | "social" | "special";
  /** level 的描述 */
    level: number;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** requirements 的描述 */
    requirements: {
    action: string;
    target: number;
    period: number;  
  };
  /** rewards 的描述 */
    rewards: {
    exp: number;
    points: number;
    items?: string[];
    features?: string[];
  };
  /** chain 的描述 */
    chain?: undefined | { nextTaskId: string; multiplier: number; };
}

// 任务进度
export interface ITaskProgress {
  /** taskId 的描述 */
    taskId: string;
  /** userId 的描述 */
    userId: string;
  /** currentValue 的描述 */
    currentValue: number;
  /** startTime 的描述 */
    startTime: Date;
  /** lastUpdateTime 的描述 */
    lastUpdateTime: Date;
  /** status 的描述 */
    status: active  completed  failed;
  chainCount: number;
}
