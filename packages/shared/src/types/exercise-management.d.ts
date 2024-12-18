/**
 * @fileoverview TS 文件 exercise-management.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 运动管理系统
export interface IExerciseManagement {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;

  // 运动能力评估
  /** fitnessAssessment 的描述 */
  fitnessAssessment: {
    cardioCapacity: CardioAssessment;
    strengthLevel: StrengthAssessment;
    flexibility: FlexibilityAssessment;
    limitations: PhysicalLimitation[];
  };

  // 个性化运动计划
  /** exercisePlan 的描述 */
  exercisePlan: {
    weeklySchedule: ExerciseSchedule[];
    progressionPlan: IProgressionPlan;
    adaptations: IExerciseAdaptation[];
    safetyGuidelines: SafetyGuideline[];
  };

  // 运动追踪
  /** exerciseTracking 的描述 */
  exerciseTracking: {
    workoutLogs: WorkoutLog[];
    performanceMetrics: PerformanceMetric[];
    recoveryData: RecoveryData[];
    injuryPrevention: InjuryPreventionLog[];
  };

  // 运动社交支持
  /** socialSupport 的描述 */
  socialSupport: {
    buddySystem: ExerciseBuddy[];
    groupActivities: GroupActivity[];
    challenges: ExerciseChallenge[];
    achievements: Achievement[];
  };
}

// 运动进度计划
export interface IProgressionPlan {
  /** phases 的描述 */
  phases: ExercisePhase[];
  /** milestones 的描述 */
  milestones: ExerciseMilestone[];
  /** adjustmentTriggers 的描述 */
  adjustmentTriggers: AdjustmentTrigger[];
  /** recoveryPeriods 的描述 */
  recoveryPeriods: RecoveryPeriod[];
}

// 运动适应性调整
export interface IExerciseAdaptation {
  /** condition 的描述 */
  condition: string;
  /** modifications 的描述 */
  modifications: ExerciseModification[];
  /** alternativeExercises 的描述 */
  alternativeExercises: AlternativeExercise[];
  /** precautions 的描述 */
  precautions: string[];
}
