// 运动管理系统
export interface ExerciseManagement {
  id: string;
  userId: string;
  
  // 运动能力评估
  fitnessAssessment: {
    cardioCapacity: CardioAssessment;
    strengthLevel: StrengthAssessment;
    flexibility: FlexibilityAssessment;
    limitations: PhysicalLimitation[];
  };
  
  // 个性化运动计划
  exercisePlan: {
    weeklySchedule: ExerciseSchedule[];
    progressionPlan: ProgressionPlan;
    adaptations: ExerciseAdaptation[];
    safetyGuidelines: SafetyGuideline[];
  };
  
  // 运动追踪
  exerciseTracking: {
    workoutLogs: WorkoutLog[];
    performanceMetrics: PerformanceMetric[];
    recoveryData: RecoveryData[];
    injuryPrevention: InjuryPreventionLog[];
  };
  
  // 运动社交支持
  socialSupport: {
    buddySystem: ExerciseBuddy[];
    groupActivities: GroupActivity[];
    challenges: ExerciseChallenge[];
    achievements: Achievement[];
  };
}

// 运动进度计划
export interface ProgressionPlan {
  phases: ExercisePhase[];
  milestones: ExerciseMilestone[];
  adjustmentTriggers: AdjustmentTrigger[];
  recoveryPeriods: RecoveryPeriod[];
}

// 运动适应性调整
export interface ExerciseAdaptation {
  condition: string;
  modifications: ExerciseModification[];
  alternativeExercises: AlternativeExercise[];
  precautions: string[];
} 