/** 健康指标数据 */
export interface HealthMetrics {
  /** 用户ID */
  userId: string;
  /** 记录时间 */
  timestamp: Date;
  /** 活动数据 */
  activity: ActivityData;
  /** 营养数据 */
  nutrition: NutritionData;
  /** 睡眠数据 */
  sleep: SleepData;
  /** 心理健康数据 */
  mentalHealth: MentalHealthData;
}

/** 活动数据 */
export interface ActivityData {
  /** 步数 */
  steps: number;
  /** 距离（米） */
  distance: number;
  /** 卡路里消耗 */
  caloriesBurned: number;
  /** 活动时长（分钟） */
  activeMinutes: number;
  /** 心率数据 */
  heartRate?: {
    /** 平均心率 */
    average: number;
    /** 最高心率 */
    max: number;
    /** 最低心率 */
    min: number;
  };
}

/** 营养数据 */
export interface NutritionData {
  /** 摄入卡路里 */
  caloriesConsumed: number;
  /** 蛋白质（克） */
  protein: number;
  /** 碳水化合物（克） */
  carbohydrates: number;
  /** 脂肪（克） */
  fat: number;
  /** 水分摄入（毫升） */
  waterIntake: number;
  /** 维生素和矿物质 */
  vitaminsAndMinerals?: Record<string, number>;
}

/** 睡眠数据 */
export interface SleepData {
  /** 入睡时间 */
  bedtime: Date;
  /** 起床时间 */
  wakeTime: Date;
  /** 总睡眠时长（分钟） */
  totalSleepTime: number;
  /** 深度睡眠时长（分钟） */
  deepSleepTime?: number;
  /** 浅度睡眠时长（分钟） */
  lightSleepTime?: number;
  /** 睡眠质量评分 */
  qualityScore?: number;
}

/** 心理健康数据 */
export interface MentalHealthData {
  /** 压力水平（0-100） */
  stressLevel: number;
  /** 情绪状态 */
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';
  /** 冥想时长（分钟） */
  meditationMinutes?: number;
  /** 焦虑评分（0-100） */
  anxietyScore?: number;
  /** 抑郁评分（0-100） */
  depressionScore?: number;
} 