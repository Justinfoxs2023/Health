// AI健康助手类型定义
export interface HealthAssistant {
  id: string;
  userId: string;
  
  // 健康建议引擎
  advisoryEngine: {
    // 异常检测阈值
    thresholds: {
      [key in HealthMetricType]: {
        low: number;
        high: number;
        criticalLow: number;
        criticalHigh: number;
      };
    };
    
    // 智能建议规则
    rules: {
      dietary: DietaryRule[];
      exercise: ExerciseRule[];
      lifestyle: LifestyleRule[];
      medication: MedicationRule[];
    };
  };
  
  // 个性化设置
  personalSettings: {
    healthGoals: HealthGoal[];
    dietaryRestrictions: string[];
    exercisePreferences: string[];
    sleepSchedule: {
      bedtime: string;
      wakeTime: string;
    };
  };
}

// 健康目标
export interface HealthGoal {
  type: HealthGoalType;
  target: number;
  deadline: Date;
  progress: number;
  status: 'active' | 'completed' | 'failed';
  reminders: boolean;
}

// 健康目标类型
export enum HealthGoalType {
  WEIGHT_LOSS = 'weightLoss',
  BLOOD_PRESSURE = 'bloodPressure',
  BLOOD_GLUCOSE = 'bloodGlucose',
  EXERCISE_DURATION = 'exerciseDuration',
  STEPS_COUNT = 'stepsCount',
  SLEEP_DURATION = 'sleepDuration'
} 