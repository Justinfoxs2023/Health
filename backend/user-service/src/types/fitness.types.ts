export interface WorkoutPlan {
  id: string;
  clientId: string;
  trainerId: string;
  exercises: Exercise[];
  schedule: WorkoutSchedule;
  goals: FitnessGoal;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  name: string;
  type: ExerciseType;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restPeriod: number;
  notes?: string;
}

export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'balance';

export interface WorkoutSchedule {
  frequency: number;
  daysOfWeek: number[];
  timeOfDay: string;
  duration: number;
}

export interface ExerciseRecord {
  id: string;
  clientId: string;
  date: Date;
  exercises: CompletedExercise[];
  metrics: WorkoutMetrics;
  feedback?: string;
  photos?: string[];
}

export interface CompletedExercise extends Exercise {
  actualSets: number;
  actualReps: number;
  actualWeight?: number;
  actualDuration?: number;
  difficulty: number;
  pain?: number;
}

export interface WorkoutMetrics {
  heartRate: {
    avg: number;
    max: number;
  };
  caloriesBurned: number;
  duration: number;
  intensity: number;
}

export interface FitnessGoal {
  type: 'strength' | 'endurance' | 'flexibility' | 'weight' | 'muscle';
  target: {
    metric: string;
    value: number;
  };
  deadline: Date;
  milestones?: {
    date: Date;
    target: number;
  }[];
} 