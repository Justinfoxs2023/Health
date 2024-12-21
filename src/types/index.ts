/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export * from './gamification';
export * from './community';
export * from './social';
export * from './entities';
export * from './base.types';
export * from './user';
export * from './exercise.types';
export * from './nutrition.types';
export * from './payment.types';
export * from './monitoring.types';
export * from './inventory.types';
export * from './logistics.types';
export * from './showcase.types';
export * from './health.types';

// 补充缺失的类型
export interface ISaleOptions {
  /** price 的描述 */
  price: number;
  /** quantity 的描述 */
  quantity: number;
  /** deliveryMethods 的描述 */
  deliveryMethods: string;
}

export interface IShipmentItem {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** quantity 的描述 */
  quantity: number;
  /** weight 的描述 */
  weight: number;
  /** volume 的描述 */
  volume: number;
}

export interface IAlert {
  /** id 的描述 */
  id: string;
  /** level 的描述 */
  level: string;
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp: Date;
}

export interface IExerciseGoal {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** target 的描述 */
  target: number;
  /** progress 的描述 */
  progress: number;
  /** deadline 的描述 */
  deadline: Date;
}

export interface IMilestone {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** isCompleted 的描述 */
  isCompleted: false | true;
}

export interface ISchedule {
  /** id 的描述 */
  id: string;
  /** dayOfWeek 的描述 */
  dayOfWeek: number;
  /** startTime 的描述 */
  startTime: string;
  /** endTime 的描述 */
  endTime: string;
}

export interface IWorkoutMetrics {
  /** caloriesBurned 的描述 */
  caloriesBurned: number;
  /** duration 的描述 */
  duration: number;
  /** distance 的描述 */
  distance: number;
  /** heartRate 的描述 */
  heartRate: number;
}

export interface IPattern {
  /** type 的描述 */
  type: string;
  /** frequency 的描述 */
  frequency: number;
  /** intensity 的描述 */
  intensity: string;
}

export interface IRecommendation {
  /** type 的描述 */
  type: string;
  /** content 的描述 */
  content: string;
  /** priority 的描述 */
  priority: number;
}
