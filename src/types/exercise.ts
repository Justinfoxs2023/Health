export interface ExercisePlan {
  id: string;
  userId: string;
  goals: ExerciseGoal[];
  milestones: Milestone[];
  schedule: Schedule[];
  intensity: string;
  duration: number;
  startDate: Date;
  endDate: Date;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId: string;
  type: string;
  duration: number;
  intensity: string;
  exercises: Exercise[];
  metrics: WorkoutMetrics;
  timestamp: Date;
}

export interface ExerciseData {
  metrics: WorkoutMetrics;
  patterns: Pattern[];
  recommendations: Recommendation[];
} 