/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IHealthData {
  /** vitals 的描述 */
  vitals: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
  /** bodyMetrics 的描述 */
  bodyMetrics: {
    height: number;
    weight: number;
    bmi: number;
    bodyFat: number;
    muscleMass: number;
  };
  /** nutrition 的描述 */
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
  /** activity 的描述 */
  activity: {
    steps: number;
    distance: number;
    activeMinutes: number;
    caloriesBurned: number;
  };
  /** sleep 的描述 */
  sleep: {
    duration: number;
    quality: number;
    deepSleep: number;
    remSleep: number;
    lightSleep: number;
    awakeTime: number;
  };
  /** stress 的描述 */
  stress: {
    level: number;
    variability: number;
    recoveryTime: number;
  };
}

export interface IRiskAlert {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** level 的描述 */
  level: 'low' | 'medium' | 'high';
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp: number;
  /** data 的描述 */
  data: Record<string, any>;
  /** handled 的描述 */
  handled: boolean;
}

export interface IRiskRule {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** condition 的描述 */
  condition: (data: IHealthData) => boolean;
  /** level 的描述 */
  level: 'low' | 'medium' | 'high';
  /** message 的描述 */
  message: string;
  /** threshold 的描述 */
  threshold?: number;
  /** cooldown 的描述 */
  cooldown?: number;
}

export interface IHealthRisk {
  /** type 的描述 */
  type: string;
  /** level 的描述 */
  level: 'low' | 'medium' | 'high';
  /** description 的描述 */
  description: string;
  /** recommendations 的描述 */
  recommendations: string[];
  /** data 的描述 */
  data?: Record<string, any>;
  /** timestamp 的描述 */
  timestamp?: number;
}

export interface IHealthMetric {
  /** type 的描述 */
  type: string;
  /** value 的描述 */
  value: number;
  /** unit 的描述 */
  unit: string;
  /** timestamp 的描述 */
  timestamp: number;
  /** normalRange 的描述 */
  normalRange?: {
    min: number;
    max: number;
  };
}

export interface IHealthTrend {
  /** metric 的描述 */
  metric: string;
  /** data 的描述 */
  data: Array<{
    value: number;
    timestamp: number;
  }>;
  /** trend 的描述 */
  trend: 'increasing' | 'decreasing' | 'stable';
  /** changeRate 的描述 */
  changeRate: number;
}

export interface IHealthRecommendation {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** priority 的描述 */
  priority: 'low' | 'medium' | 'high';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** actions 的描述 */
  actions: string[];
  /** relatedMetrics 的描述 */
  relatedMetrics: string[];
  /** timestamp 的描述 */
  timestamp: number;
}

export interface IHealthGoal {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** target 的描述 */
  target: number;
  /** current 的描述 */
  current: number;
  /** unit 的描述 */
  unit: string;
  /** startDate 的描述 */
  startDate: number;
  /** endDate 的描述 */
  endDate: number;
  /** status 的描述 */
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface IHealthNotification {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** message 的描述 */
  message: string;
  /** priority 的描述 */
  priority: 'low' | 'medium' | 'high';
  /** timestamp 的描述 */
  timestamp: number;
  /** read 的描述 */
  read: boolean;
  /** data 的描述 */
  data?: Record<string, any>;
}

export interface IHealthReport {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** date 的描述 */
  date: number;
  /** metrics 的描述 */
  metrics: IHealthMetric[];
  /** risks 的描述 */
  risks: IHealthRisk[];
  /** recommendations 的描述 */
  recommendations: IHealthRecommendation[];
  /** goals 的描述 */
  goals: IHealthGoal[];
  /** summary 的描述 */
  summary: {
    overallHealth: 'poor' | 'fair' | 'good' | 'excellent';
    mainRisks: IHealthRisk[];
    improvements: IHealthRisk[];
    score: number;
  };
}
