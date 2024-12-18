/**
 * @fileoverview TS 文件 exercise.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IExercisePlan {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** goals 的描述 */
  goals: ExerciseGoal;
  /** milestones 的描述 */
  milestones: Milestone;
  /** schedule 的描述 */
  schedule: Schedule;
  /** intensity 的描述 */
  intensity: string;
  /** duration 的描述 */
  duration: number;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate: Date;
}

export interface IWorkoutSession {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** planId 的描述 */
  planId: string;
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: string;
  /** exercises 的描述 */
  exercises: Exercise;
  /** metrics 的描述 */
  metrics: WorkoutMetrics;
  /** timestamp 的描述 */
  timestamp: Date;
}

export interface IExerciseData {
  /** metrics 的描述 */
  metrics: WorkoutMetrics;
  /** patterns 的描述 */
  patterns: Pattern;
  /** recommendations 的描述 */
  recommendations: Recommendation;
}
