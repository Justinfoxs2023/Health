/**
 * @fileoverview TS 文件 HealthAdvice.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export type AdviceCategoryType = 'diet' | 'exercise' | 'lifestyle' | 'medical';
export type PriorityLevelType = 'high' | 'medium' | 'low';

export interface IHealthAdvice {
  /** categories 的描述 */
  categories: ICategoryAdvice[];
  /** priority 的描述 */
  priority: PriorityLevelType;
  /** timeframe 的描述 */
  timeframe: string;
  /** goals 的描述 */
  goals: IHealthGoal[];
}

export interface ICategoryAdvice {
  /** type 的描述 */
  type: AdviceCategoryType;
  /** recommendations 的描述 */
  recommendations: IRecommendation[];
}

export interface IRecommendation {
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** actions 的描述 */
  actions: string[];
  /** expectedOutcomes 的描述 */
  expectedOutcomes: string[];
  /** timeframe 的描述 */
  timeframe: string;
  /** priority 的描述 */
  priority: PriorityLevelType;
  /** precautions 的描述 */
  precautions?: string[];
}

export interface IHealthGoal {
  /** category 的描述 */
  category: AdviceCategoryType;
  /** description 的描述 */
  description: string;
  /** target 的描述 */
  target: any;
  /** timeline 的描述 */
  timeline: string;
  /** milestones 的描述 */
  milestones: IMilestone[];
}

export interface IMilestone {
  /** description 的描述 */
  description: string;
  /** target 的描述 */
  target: any;
  /** deadline 的描述 */
  deadline: Date;
  /** completed 的描述 */
  completed: boolean;
}
