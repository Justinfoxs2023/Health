import { BaseHealthData } from '../../health/types/health-base.types';

// 运动计划时间表
export interface ExerciseSchedule {
  dayOfWeek: number;
  timeSlots: Array<{
    startTime: string;
    endTime: string;
    type: ExerciseType;
    intensity: ExerciseIntensity;
  }>;
  flexibility: boolean; // 是否可调整
  priority: number;
}

// 运动阶段
export interface ExercisePhase {
  id: string;
  name: string;
  duration: number; // 天数
  focus: string[];
  goals: {
    primary: string;
    secondary: string[];
    metrics: Record<string, number>;
  };
  exercises: Array<{
    type: ExerciseType;
    sets: number;
    reps: number;
    intensity: ExerciseIntensity;
    progression: ProgressionRule[];
  }>;
}

// 适应性规则
export interface AdaptationRule {
  trigger: {
    metric: string;
    condition: 'above' | 'below' | 'between';
    values: number[];
    duration: number; // 持续天数
  };
  adjustment: {
    target: 'intensity' | 'volume' | 'frequency' | 'type';
    action: 'increase' | 'decrease' | 'modify';
    value: number | string;
  };
  constraints: {
    maxAdjustment: number;
    minInterval: number; // 最小调整间隔(天)
    prerequisites: string[];
  };
}

// 运动进度
export interface ExerciseProgress extends BaseHealthData {
  planId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    sessionsCompleted: number;
    totalDuration: number;
    averageIntensity: number;
    caloriesBurned: number;
  };
  achievements: {
    goals: Array<{
      id: string;
      progress: number;
      achieved: boolean;
    }>;
    milestones: string[];
    streaks: number;
  };
  feedback: {
    perceived: number;
    difficulty: number;
    enjoyment: number;
    comments: string;
  };
}

// 计划评估
export interface PlanEvaluation {
  achievementRate: number;
  strengthProgress: {
    overall: number;
    byMuscleGroup: Record<string, number>;
  };
  enduranceProgress: {
    cardio: number;
    muscular: number;
  };
  technicalProgress: {
    form: number;
    consistency: number;
    complexity: number;
  };
  requiresAdjustment: boolean;
  adjustmentSuggestions: string[];
}

// 运动建议
export interface ExerciseRecommendation {
  exercises: Array<{
    type: ExerciseType;
    duration: number;
    intensity: ExerciseIntensity;
    instructions: string[];
  }>;
  intensity: {
    target: number;
    range: [number, number];
  };
  duration: {
    recommended: number;
    minimum: number;
    maximum: number;
  };
  precautions: string[];
  alternatives: Array<{
    condition: string;
    exercises: string[];
  }>;
}

// 运动类型
export type ExerciseType = 
  | 'cardio'
  | 'strength'
  | 'flexibility'
  | 'balance'
  | 'coordination'
  | 'rehabilitation';

// 运动强度
export type ExerciseIntensity = 
  | 'very_light'
  | 'light'
  | 'moderate'
  | 'vigorous'
  | 'maximum';

// 进阶规则
export interface ProgressionRule {
  condition: string;
  adjustment: {
    parameter: string;
    value: number;
  };
} 