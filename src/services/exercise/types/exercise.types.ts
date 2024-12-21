import { IBaseHealthData } from '../../health/types/health-base.types';

// 运动计划时间表
export interface IExerciseSchedule {
  /** dayOfWeek 的描述 */
    dayOfWeek: number;
  /** timeSlots 的描述 */
    timeSlots: Array{
    startTime: string;
    endTime: string;
    type: ExerciseType;
    intensity: ExerciseIntensity;
  }>;
  flexibility: boolean; // 是否可调整
  priority: number;
}

// 运动阶段
export interface IExercisePhase {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** duration 的描述 */
    duration: number;  
  /** focus 的描述 */
    focus: string;
  /** goals 的描述 */
    goals: {
    primary: string;
    secondary: string;
    metrics: Recordstring, number;
  };
  /** exercises 的描述 */
    exercises: Array<{
    type: ExerciseType;
    sets: number;
    reps: number;
    intensity: ExerciseIntensityType;
    progression: IProgressionRule[];
  }>;
}

// 适应性规则
export interface IAdaptationRule {
  /** trigger 的描述 */
    trigger: {
    metric: string;
    condition: above  below  between;
    values: number;
    duration: number;  
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
export interface IExerciseProgress extends IBaseHealthData {
  /** planId 的描述 */
    planId: string;
  /** period 的描述 */
    period: {
    start: Date;
    end: Date;
  };
  /** metrics 的描述 */
    metrics: {
    sessionsCompleted: number;
    totalDuration: number;
    averageIntensity: number;
    caloriesBurned: number;
  };
  /** achievements 的描述 */
    achievements: {
    goals: Array<{
      id: string;
      progress: number;
      achieved: boolean;
    }>;
    milestones: string[];
    streaks: number;
  };
  /** feedback 的描述 */
    feedback: {
    perceived: number;
    difficulty: number;
    enjoyment: number;
    comments: string;
  };
}

// 计划评估
export interface IPlanEvaluation {
  /** achievementRate 的描述 */
    achievementRate: number;
  /** strengthProgress 的描述 */
    strengthProgress: {
    overall: number;
    byMuscleGroup: Recordstring, number;
  };
  /** enduranceProgress 的描述 */
    enduranceProgress: {
    cardio: number;
    muscular: number;
  };
  /** technicalProgress 的描述 */
    technicalProgress: {
    form: number;
    consistency: number;
    complexity: number;
  };
  /** requiresAdjustment 的描述 */
    requiresAdjustment: false | true;
  /** adjustmentSuggestions 的描述 */
    adjustmentSuggestions: string[];
}

// 运动建议
export interface IExerciseRecommendation {
  /** exercises 的描述 */
    exercises: Array{
    type: ExerciseType;
    duration: number;
    intensity: ExerciseIntensity;
    instructions: string;
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
  any;

// 运动强度
export type ExerciseIntensityType = any;

// 进阶规则
export interface IProgressionRule {
  /** condition 的描述 */
    condition: string;
  /** adjustment 的描述 */
    adjustment: {
    parameter: string;
    value: number;
  };
}
