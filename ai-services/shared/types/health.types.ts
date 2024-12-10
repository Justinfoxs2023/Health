/**
 * 健康数据接口定义
 */
export interface HealthData {
  userId: string;
  timestamp: Date;
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
  mentalData: {
    stressLevel: number; // 压力水平(0-10)
    moodScore: number; // 情绪评分(0-10)
    sleepQuality: number; // 睡眠质量(0-10)
  };
  physicalData: PhysicalData;
  mentalData: MentalData;
  nutritionData: NutritionData;
  lifestyleData: LifestyleData;
  medicalData?: MedicalData;
  environmentalData?: EnvironmentalData;
}

/**
 * 身体数据
 */
export interface PhysicalData {
  height: number; // 身高(cm)
  weight: number; // 体重(kg)
  bloodPressure: {
    systolic: number; // 收缩压(mmHg)
    diastolic: number; // 舒张压(mmHg)
  };
  heartRate: number; // 心率(bpm)
  bodyTemperature: number; // 体温(°C)
  bloodOxygen: number; // 血氧饱和度(%)
}

/**
 * 运动数据
 */
export interface ExerciseData {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  timestamp: Date;
}

/**
 * 心理健康数据
 */
export interface MentalData {
  stressLevel: number;
  moodScore: number;
  sleepQuality: number;
  anxietyLevel?: number;
  depressionLevel?: number;
}

/**
 * 营养数据
 */
export interface NutritionData {
  calorieIntake: number;
  proteinIntake: number;
  carbIntake: number;
  fatIntake: number;
  waterIntake: number;
  meals: MealData[];
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: Date;
  items: MealItem[];
}

export interface MealItem {
  name: string;
  amount: number;
  unit: string;
  calories: number;
}

/**
 * 生活方式数据
 */
export interface LifestyleData {
  sleepHours: number;
  activityLevel: number;
  smokingStatus: boolean;
  alcoholConsumption: number;
  workHours: number;
}

/**
 * 评估结果
 */
export interface AssessmentResult {
  userId: string;
  overallScore: number;
  categoryScores: {
    physical: number;
    mental: number;
    nutrition: number;
    lifestyle: number;
  };
  recommendations: string[];
  timestamp: Date;
}

/**
 * 用户档案
 */
export interface IUserProfile {
  userId: string;
  personalInfo: {
    age: number;
    gender: string;
    height: number;
    weight: number;
  };
  healthConditions: IHealthCondition[];
  capabilities: IUserCapability[];
  allergies: IAllergy[];
  schedule: IUserSchedule;
}

/**
 * 健康状况
 */
export interface IHealthCondition {
  name: string;
  diagnosisDate: Date;
  status: 'active' | 'resolved';
  severity: 'mild' | 'moderate' | 'severe';
  diagnosisDate: Date;
  status: 'active' | 'managed' | 'resolved';
  medications?: string[];
}

/**
 * 用户能力
 */
export interface IUserCapability {
  type: 'physical' | 'cognitive' | 'social';
  level: number;
  limitations?: string[];
}

/**
 * 过敏信息
 */
export interface IAllergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reactions: string[];
}

/**
 * 用户日程
 */
export interface IUserSchedule {
  workDays: string[];
  workHours: {
    start: string;
    end: string;
  };
  preferredExerciseTime: string[];
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
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  frequency: number;
  benefits: string[];
  precautions?: string[];
}

/**
 * 饮食推荐
 */
export interface IDietRecommendation {
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks?: string[];
  };
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  restrictions?: string[];
}

/**
 * 生活方式推荐
 */
export interface ILifestyleRecommendation {
  sleepSchedule: {
    bedtime: string;
    wakeTime: string;
    duration: number;
  };
  activities: {
    type: string;
    duration: number;
    frequency: string;
  }[];
  stressManagement: string[];
}

/**
 * 推荐上下文
 */
export interface IRecommendationContext {
  userProfile: IUserProfile;
  healthData: HealthData;
  previousRecommendations?: any[];
  adherenceRate?: number;
}

/**
 * 推荐结果
 */
export interface IRecommendationResult {
  userId: string;
  timestamp: Date;
  exercise: IExerciseRecommendation[];
  diet: IDietRecommendation;
  lifestyle: ILifestyleRecommendation;
  priority: 'high' | 'medium' | 'low';
}

/**
 * 时间序列数据
 */
export interface ITimeSeriesData {
  timestamp: Date;
  value: number;
  type: string;
  metadata?: Record<string, any>;
}

/**
 * 分析结果
 */
export interface IAnalysisResult {
  userId: string;
  timestamp: Date;
  trends: ITrendAnalysis[];
  patterns: IPatternResult[];
  predictions: IForecast[];
}

/**
 * 趋势分析
 */
export interface ITrendAnalysis {
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  magnitude: number;
  confidence: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * 预测结果
 */
export interface IForecast {
  metric: string;
  predictions: {
    timestamp: Date;
    value: number;
    confidence: number;
  }[];
  horizon: string;
}

/**
 * 模式数据
 */
export interface IPatternData {
  type: string;
  values: number[];
  timestamps: Date[];
  metadata?: Record<string, any>;
}

/**
 * 模式分析结果
 */
export interface IPatternResult {
  type: string;
  description: string;
  significance: number;
  frequency?: string;
  duration?: string;
  relatedMetrics: string[];
}

/**
 * 聚类分析
 */
export interface IClusterAnalysis {
  clusters: {
    id: number;
    centroid: number[];
    size: number;
    members: string[];
  }[];
  metrics: string[];
  quality: number;
}

/**
 * 异常检测
 */
export interface IAnomalyDetection {
  anomalies: {
    timestamp: Date;
    metric: string;
    value: number;
    score: number;
    type: string;
  }[];
  threshold: number;
  sensitivity: number;
}

/**
 * 相关性数据
 */
export interface ICorrelationData {
  metrics: string[];
  values: number[][];
  timestamps: Date[];
}

/**
 * 相关性结果
 */
export interface ICorrelationResult {
  pairs: {
    metrics: [string, string];
    coefficient: number;
    significance: number;
    lag?: number;
  }[];
  method: string;
}

/**
 * 因素分析
 */
export interface IFactorAnalysis {
  factors: {
    name: string;
    loading: number;
    variables: string[];
  }[];
  variance: number;
}

/**
 * 排序因素
 */
export interface IRankedFactors {
  metric: string;
  factors: {
    name: string;
    importance: number;
    direction: 'positive' | 'negative';
  }[];
  method: string;
}

/**
 * 分析上下文
 */
export interface IAnalysisContext {
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  aggregation?: string;
  filters?: Record<string, any>;
} 