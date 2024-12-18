/**
 * @fileoverview TS 文件 fitness.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IWorkoutPlan {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** trainerId 的描述 */
  trainerId: string;
  /** exercises 的描述 */
  exercises: IExercise[];
  /** schedule 的描述 */
  schedule: IWorkoutSchedule;
  /** goals 的描述 */
  goals: IFitnessGoal;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface IExercise {
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: ExerciseType;
  /** sets 的描述 */
  sets: number;
  /** reps 的描述 */
  reps: number;
  /** weight 的描述 */
  weight?: number;
  /** duration 的描述 */
  duration?: number;
  /** restPeriod 的描述 */
  restPeriod: number;
  /** notes 的描述 */
  notes?: string;
}

export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'balance';

export interface IWorkoutSchedule {
  /** frequency 的描述 */
  frequency: number;
  /** daysOfWeek 的描述 */
  daysOfWeek: number[];
  /** timeOfDay 的描述 */
  timeOfDay: string;
  /** duration 的描述 */
  duration: number;
}

export interface IExerciseRecord {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** date 的描述 */
  date: Date;
  /** exercises 的描述 */
  exercises: ICompletedExercise[];
  /** metrics 的描述 */
  metrics: IWorkoutMetrics;
  /** feedback 的描述 */
  feedback?: string;
  /** photos 的描述 */
  photos?: string[];
}

export interface ICompletedExercise extends IExercise {
  /** actualSets 的描述 */
  actualSets: number;
  /** actualReps 的描述 */
  actualReps: number;
  /** actualWeight 的描述 */
  actualWeight?: number;
  /** actualDuration 的描述 */
  actualDuration?: number;
  /** difficulty 的描述 */
  difficulty: number;
  /** pain 的描述 */
  pain?: number;
}

export interface IWorkoutMetrics {
  /** heartRate 的描述 */
  heartRate: {
    avg: number;
    max: number;
  };
  /** caloriesBurned 的描述 */
  caloriesBurned: number;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: number;
}

export interface IFitnessGoal {
  /** type 的描述 */
  type: 'strength' | 'endurance' | 'flexibility' | 'weight' | 'muscle';
  /** target 的描述 */
  target: {
    metric: string;
    value: number;
  };
  /** deadline 的描述 */
  deadline: Date;
  /** milestones 的描述 */
  milestones?: {
    date: Date;
    target: number;
  }[];
}
