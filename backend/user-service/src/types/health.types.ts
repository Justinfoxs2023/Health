/**
 * @fileoverview TS 文件 health.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IHealthPlan {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** advisorId 的描述 */
  advisorId: string;
  /** goals 的描述 */
  goals: IHealthGoal[];
  /** recommendations 的描述 */
  recommendations: IHealthRecommendation[];
  /** schedule 的描述 */
  schedule: IHealthSchedule;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface IHealthGoal {
  /** category 的描述 */
  category: HealthCategoryType;
  /** description 的描述 */
  description: string;
  /** target 的描述 */
  target: {
    metric: string;
    value: number;
    unit: string;
  };
  /** priority 的描述 */
  priority: number;
  /** deadline 的描述 */
  deadline: Date;
  /** progress 的描述 */
  progress: number;
}

export type HealthCategoryType = 'sleep' | 'stress' | 'diet' | 'exercise' | 'lifestyle' | 'mental';

export interface IHealthRecommendation {
  /** category 的描述 */
  category: HealthCategoryType;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** actions 的描述 */
  actions: string[];
  /** priority 的描述 */
  priority: number;
  /** frequency 的描述 */
  frequency?: string;
}

export interface IHealthSchedule {
  /** checkups 的描述 */
  checkups: IAppointment[];
  /** activities 的描述 */
  activities: IScheduledActivity[];
  /** reminders 的描述 */
  reminders: IHealthReminder[];
}

export interface IAppointment {
  /** type 的描述 */
  type: string;
  /** date 的描述 */
  date: Date;
  /** duration 的描述 */
  duration: number;
  /** location 的描述 */
  location?: string;
  /** notes 的描述 */
  notes?: string;
}

export interface IScheduledActivity {
  /** type 的描述 */
  type: string;
  /** frequency 的描述 */
  frequency: string;
  /** timeOfDay 的描述 */
  timeOfDay: string;
  /** duration 的描述 */
  duration: number;
  /** instructions 的描述 */
  instructions?: string;
}

export interface IHealthReminder {
  /** type 的描述 */
  type: string;
  /** frequency 的描述 */
  frequency: string;
  /** time 的描述 */
  time: string;
  /** message 的描述 */
  message: string;
}

export interface ILifestyleRecord {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** date 的描述 */
  date: Date;
  /** sleep 的描述 */
  sleep: {
    duration: number;
    quality: number;
    notes?: string;
  };
  /** stress 的描述 */
  stress: {
    level: number;
    factors?: string[];
    notes?: string;
  };
  /** activities 的描述 */
  activities: {
    type: string;
    duration: number;
    intensity?: number;
  }[];
  /** mood 的描述 */
  mood: number;
  /** notes 的描述 */
  notes?: string;
}
