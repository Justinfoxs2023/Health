/**
 * @fileoverview TS 文件 health-assistant.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// AI健康助手类型定义
export interface IHealthAssistant {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;

  // 健康建议引擎
  /** advisoryEngine 的描述 */
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
  /** personalSettings 的描述 */
  personalSettings: {
    healthGoals: IHealthGoal[];
    dietaryRestrictions: string[];
    exercisePreferences: string[];
    sleepSchedule: {
      bedtime: string;
      wakeTime: string;
    };
  };
}

// 健康目标
export interface IHealthGoal {
  /** type 的描述 */
  type: HealthGoalType;
  /** target 的描述 */
  target: number;
  /** deadline 的描述 */
  deadline: Date;
  /** progress 的描述 */
  progress: number;
  /** status 的描述 */
  status: 'active' | 'completed' | 'failed';
  /** reminders 的描述 */
  reminders: boolean;
}

// 健康目标类型
export enum HealthGoalType {
  WEIGHT_LOSS = 'weightLoss',
  BLOOD_PRESSURE = 'bloodPressure',
  BLOOD_GLUCOSE = 'bloodGlucose',
  EXERCISE_DURATION = 'exerciseDuration',
  STEPS_COUNT = 'stepsCount',
  SLEEP_DURATION = 'sleepDuration',
}
