/**
 * @fileoverview TS 文件 health-data.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康数据类型定义
export interface IHealthData {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** vitalSigns 的描述 */
  vitalSigns?: IVitalSigns;
  /** exercise 的描述 */
  exercise?: IExercise;
  /** sleep 的描述 */
  sleep?: ISleep;
  /** diet 的描述 */
  diet?: IDiet;
  /** metrics 的描述 */
  metrics?: IHealthMetrics;
}

export interface IVitalSigns {
  /** heartRate 的描述 */
  heartRate?: number;
  /** bloodPressure 的描述 */
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  /** temperature 的描述 */
  temperature?: number;
  /** respiratoryRate 的描述 */
  respiratoryRate?: number;
  /** oxygenSaturation 的描述 */
  oxygenSaturation?: number;
}

export interface IExercise {
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** caloriesBurned 的描述 */
  caloriesBurned: number;
  /** steps 的描述 */
  steps?: number;
  /** distance 的描述 */
  distance?: number;
}

export interface ISleep {
  /** startTime 的描述 */
  startTime: Date;
  /** endTime 的描述 */
  endTime: Date;
  /** quality 的描述 */
  quality: number;
  /** stages 的描述 */
  stages?: {
    deep: number;
    light: number;
    rem: number;
  };
}

export interface IDiet {
  /** meals 的描述 */
  meals: Array<{
    time: Date;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: Array<{
      name: string;
      portion: number;
      calories: number;
      nutrients: {
        protein: number;
        carbs: number;
        fat: number;
      };
    }>;
  }>;
  /** totalCalories 的描述 */
  totalCalories: number;
  /** waterIntake 的描述 */
  waterIntake: number;
}

export interface IHealthMetrics {
  /** bmi 的描述 */
  bmi?: number;
  /** bodyFat 的描述 */
  bodyFat?: number;
  /** muscleMass 的描述 */
  muscleMass?: number;
  /** boneDensity 的描述 */
  boneDensity?: number;
  /** metabolicRate 的描述 */
  metabolicRate?: number;
}
