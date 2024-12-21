/**
 * @fileoverview TS 文件 health.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 健康数据接口定义
 */
export interface IHealthData {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** physicalData 的描述 */
  physicalData: {
    height: number; // 身高(cm)
    weight: number; // 体重(kg)
    bloodPressure: {
      systolic: number; // 收缩压(mmHg)
      diastolic: number; // 舒张压(mmHg)
    };
    heartRate: number; // 心率(bpm)
    bodyTemperature: number; // 体温(°C)
    bloodOxygen: number; // 血氧饱和度(%)
  };
  /** mentalData 的描述 */
  mentalData: {
    stressLevel: number; // 压力水平(0-10)
    moodScore: number; // 情绪评分(0-10)
    sleepQuality: number; // 睡眠质量(0-10)
  };
  /** physicalData 的描述 */
  physicalData: IPhysicalData;
  /** mentalData 的描述 */
  mentalData: IMentalData;
  /** nutritionData 的描述 */
  nutritionData: INutritionData;
  /** lifestyleData 的描述 */
  lifestyleData: ILifestyleData;
  /** medicalData 的描述 */
  medicalData?: MedicalData;
  /** environmentalData 的描述 */
  environmentalData?: EnvironmentalData;
}

/**
 * 身体数据
 */
export interface IPhysicalData {
  /** height 的描述 */
  height: number; // 身高(cm)
  /** weight 的描述 */
  weight: number; // 体重(kg)
  /** bloodPressure 的描述 */
  bloodPressure: {
    systolic: number; // 收缩压(mmHg)
    diastolic: number; // 舒张压(mmHg)
  };
  /** heartRate 的描述 */
  heartRate: number; // 心率(bpm)
  /** bodyTemperature 的描述 */
  bodyTemperature: number; // 体温(°C)
  /** bloodOxygen 的描述 */
  bloodOxygen: number; // 血氧饱度(%)
}

/**
 * 运动数据
 */
export interface IExerciseData {
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** caloriesBurned 的描述 */
  caloriesBurned: number;
  /** timestamp 的描述 */
  timestamp: Date;
}

/**
 * 心理健康数据
 */
export interface IMentalData {
  /** stressLevel 的描述 */
  stressLevel: number;
  /** moodScore 的描述 */
  moodScore: number;
  /** sleepQuality 的描述 */
  sleepQuality: number;
  /** anxietyLevel 的描述 */
  anxietyLevel?: number;
  /** depressionLevel 的描述 */
  depressionLevel?: number;
}

/**
 * 营养数据
 */
export interface INutritionData {
  /** calorieIntake 的描述 */
  calorieIntake: number;
  /** waterIntake 的描述 */
  waterIntake: number;
  /** proteinIntake 的描述 */
  proteinIntake: number;
  /** carbIntake 的描述 */
  carbIntake: number;
  /** fatIntake 的描述 */
  fatIntake: number;
  /** meals 的描述 */
  meals: {
    type: string;
    time: Date;
    items: {
      name: string;
      amount: number;
      unit: string;
      calories: number;
    }[];
  }[];
}

/**
 * 生活方式数据
 */
export interface ILifestyleData {
  /** sleepHours 的描述 */
  sleepHours: number;
  /** activityLevel 的描述 */
  activityLevel: number;
  /** activities 的描述 */
  activities?: {
    type: string;
    duration: number;
    intensity: number;
    caloriesBurned: number;
  }[];
}

/**
 * 评估结果
 */
export interface IAssessmentResult {
  /** userId 的描述 */
  userId: string;
  /** overallScore 的描述 */
  overallScore: number;
  /** categoryScores 的描述 */
  categoryScores: {
    physical: number;
    mental: number;
    nutrition: number;
    lifestyle: number;
  };
  /** recommendations 的描述 */
  recommendations: string[];
  /** timestamp 的描述 */
  timestamp: Date;
}

/**
 * 用户档案
 */
export interface IUserProfile {
  /** userId 的描述 */
  userId: string;
  /** personalInfo 的描述 */
  personalInfo: {
    age: number;
    gender: string;
    height: number;
    weight: number;
  };
  /** healthConditions 的描述 */
  healthConditions: IHealthCondition[];
  /** capabilities 的描述 */
  capabilities: IUserCapability[];
  /** allergies 的描述 */
  allergies: IAllergy[];
  /** schedule 的描述 */
  schedule: IUserSchedule;
}

/**
 * 健康状况
 */
export interface IHealthCondition {
  /** name 的描述 */
  name: string;
  /** diagnosisDate 的描述 */
  diagnosisDate: Date;
  /** status 的描述 */
  status: 'active' | 'resolved';
  /** severity 的描述 */
  severity: 'mild' | 'moderate' | 'severe';
  /** diagnosisDate 的描述 */
  diagnosisDate: Date;
  /** status 的描述 */
  status: 'active' | 'managed' | 'resolved';
  /** medications 的描述 */
  medications?: string[];
}

/**
 * 用户能力
 */
export interface IUserCapability {
  /** type 的描述 */
  type: 'physical' | 'cognitive' | 'social';
  /** level 的描述 */
  level: number;
  /** limitations 的描述 */
  limitations?: string[];
}

/**
 * 过敏信息
 */
export interface IAllergy {
  /** allergen 的描述 */
  allergen: string;
  /** severity 的描述 */
  severity: 'mild' | 'moderate' | 'severe';
  /** reactions 的描述 */
  reactions: string[];
}

/**
 * 用户日程
 */
export interface IUserSchedule {
  /** workDays 的描述 */
  workDays: string[];
  /** workHours 的描述 */
  workHours: {
    start: string;
    end: string;
  };
  /** preferredExerciseTime 的描述 */
  preferredExerciseTime: string[];
  /** mealTimes 的描述 */
  mealTimes: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

/**
 * 运动推荐
 */
export interface IExerciseRecommendation {
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** frequency 的描述 */
  frequency: number;
  /** benefits 的描述 */
  benefits: string[];
  /** precautions 的描述 */
  precautions?: string[];
}

/**
 * 饮食推荐
 */
export interface IDietRecommendation {
  /** mealPlan 的描述 */
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks?: string[];
  };
  /** nutrients 的描述 */
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  /** restrictions 的描述 */
  restrictions?: string[];
}

/**
 * 生活方式推荐
 */
export interface ILifestyleRecommendation {
  /** sleepSchedule 的描述 */
  sleepSchedule: {
    bedtime: string;
    wakeTime: string;
    duration: number;
  };
  /** activities 的描述 */
  activities: {
    type: string;
    duration: number;
    frequency: string;
  }[];
  /** stressManagement 的描述 */
  stressManagement: string[];
}

/**
 * 推荐上下文
 */
export interface IRecommendationContext {
  /** userProfile 的描述 */
  userProfile: IUserProfile;
  /** healthData 的描述 */
  healthData: IHealthData;
  /** previousRecommendations 的描述 */
  previousRecommendations?: any[];
  /** adherenceRate 的描述 */
  adherenceRate?: number;
}

/**
 * 推荐结果
 */
export interface IRecommendationResult {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** exercise 的描述 */
  exercise: IExerciseRecommendation[];
  /** diet 的描述 */
  diet: IDietRecommendation;
  /** lifestyle 的描述 */
  lifestyle: ILifestyleRecommendation;
  /** priority 的描述 */
  priority: 'high' | 'medium' | 'low';
}

/**
 * 时间序列数据
 */
export interface ITimeSeriesData {
  /** timestamp 的描述 */
  timestamp: Date;
  /** value 的描述 */
  value: number;
  /** type 的描述 */
  type: string;
  /** metadata 的描述 */
  metadata?: Record<string, any>;
}

/**
 * 分析结果
 */
export interface IAnalysisResult {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** trends 的描述 */
  trends: ITrendAnalysis[];
  /** patterns 的描述 */
  patterns: IPatternResult[];
  /** predictions 的描述 */
  predictions: IForecast[];
}

/**
 * 趋势分析
 */
export interface ITrendAnalysis {
  /** metric 的描述 */
  metric: string;
  /** trend 的描述 */
  trend: 'increasing' | 'decreasing' | 'stable';
  /** magnitude 的描述 */
  magnitude: number;
  /** confidence 的描述 */
  confidence: number;
  /** period 的描述 */
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * 预测结果
 */
export interface IForecast {
  /** metric 的描述 */
  metric: string;
  /** predictions 的描述 */
  predictions: {
    timestamp: Date;
    value: number;
    confidence: number;
  }[];
  /** horizon 的描述 */
  horizon: string;
}

/**
 * 模式数据
 */
export interface IPatternData {
  /** type 的描述 */
  type: string;
  /** values 的描述 */
  values: number[];
  /** timestamps 的描述 */
  timestamps: Date[];
  /** metadata 的描述 */
  metadata?: Record<string, any>;
}

/**
 * 模式分析结果
 */
export interface IPatternResult {
  /** type 的描述 */
  type: string;
  /** description 的描述 */
  description: string;
  /** significance 的描述 */
  significance: number;
  /** frequency 的描述 */
  frequency?: string;
  /** duration 的描述 */
  duration?: string;
  /** relatedMetrics 的描述 */
  relatedMetrics: string[];
}

/**
 * 聚类分析
 */
export interface IClusterAnalysis {
  /** clusters 的描述 */
  clusters: {
    id: number;
    centroid: number[];
    size: number;
    members: string[];
  }[];
  /** metrics 的描述 */
  metrics: string[];
  /** quality 的描述 */
  quality: number;
}

/**
 * 异常检测
 */
export interface IAnomalyDetection {
  /** anomalies 的描述 */
  anomalies: {
    timestamp: Date;
    metric: string;
    value: number;
    score: number;
    type: string;
  }[];
  /** threshold 的描述 */
  threshold: number;
  /** sensitivity 的描述 */
  sensitivity: number;
}

/**
 * 相关性数据
 */
export interface ICorrelationData {
  /** metrics 的描述 */
  metrics: string[];
  /** values 的描述 */
  values: number[][];
  /** timestamps 的描述 */
  timestamps: Date[];
}

/**
 * 相关性结果
 */
export interface ICorrelationResult {
  /** pairs 的描述 */
  pairs: {
    metrics: [string, string];
    coefficient: number;
    significance: number;
    lag?: number;
  }[];
  /** method 的描述 */
  method: string;
}

/**
 * 因素分析
 */
export interface IFactorAnalysis {
  /** factors 的描述 */
  factors: {
    name: string;
    loading: number;
    variables: string[];
  }[];
  /** variance 的描述 */
  variance: number;
}

/**
 * 排序因素
 */
export interface IRankedFactors {
  /** metric 的描述 */
  metric: string;
  /** factors 的描述 */
  factors: {
    name: string;
    importance: number;
    direction: 'positive' | 'negative';
  }[];
  /** method 的描述 */
  method: string;
}

/**
 * 分析上下文
 */
export interface IAnalysisContext {
  /** userId 的描述 */
  userId: string;
  /** timeRange 的描述 */
  timeRange: {
    start: Date;
    end: Date;
  };
  /** metrics 的描述 */
  metrics: string[];
  /** aggregation 的描述 */
  aggregation?: string;
  /** filters 的描述 */
  filters?: Record<string, any>;
}
