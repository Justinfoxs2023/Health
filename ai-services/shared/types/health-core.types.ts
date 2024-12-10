/**
 * 核心健康数据类型定义
 */

// 基础数据类型
export interface BaseData {
  userId: string;
  timestamp: Date;
}

// 生命体征数据
export interface VitalSignsData extends BaseData {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature: number;
  respiratoryRate: number;
  bloodOxygen: number;
}

// 运动数据
export interface ExerciseData extends BaseData {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned?: number;
  heartRate?: {
    average: number;
    max: number;
    min: number;
  };
  steps?: number;
  distance?: number;
}

// 饮食数据
export interface NutritionData extends BaseData {
  meals: MealData[];
  waterIntake: number;
  supplements?: SupplementData[];
}

// 餐食数据
export interface MealData {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    vitamins?: {[key: string]: number};
    minerals?: {[key: string]: number};
  };
  timestamp: Date;
  location?: string;
  mood?: string;
}

// 营养补充剂数据
export interface SupplementData {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  startDate: Date;
  endDate?: Date;
}

// 睡眠数据
export interface SleepData extends BaseData {
  duration: number;
  quality: number;
  startTime: Date;
  endTime: Date;
  stages?: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
  interruptions?: {
    count: number;
    totalDuration: number;
    reasons?: string[];
  };
  environmentalFactors?: {
    temperature?: number;
    humidity?: number;
    noise?: number;
    light?: number;
  };
}

// 压力数据
export interface StressData extends BaseData {
  level: number;
  symptoms: string[];
  triggers?: string[];
  copingMechanisms?: string[];
  duration?: number;
  impact?: {
    sleep?: number;
    appetite?: number;
    mood?: number;
    productivity?: number;
  };
}

// 医疗历史数据
export interface MedicalHistoryData extends BaseData {
  conditions: ConditionData[];
  medications: MedicationData[];
  allergies: string[];
  familyHistory: FamilyHistoryData[];
  immunizations?: ImmunizationData[];
  surgeries?: SurgeryData[];
  labTests?: LabTestData[];
}

// 疾病状况数据
export interface ConditionData {
  name: string;
  diagnosisDate: Date;
  status: 'active' | 'resolved';
  severity?: 'mild' | 'moderate' | 'severe';
  symptoms?: string[];
  treatments?: string[];
  specialists?: string[];
  notes?: string;
}

// 药物数据
export interface MedicationData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  purpose?: string;
  sideEffects?: string[];
  effectiveness?: number;
  prescribedBy?: string;
  interactions?: string[];
}

// 家族病史数据
export interface FamilyHistoryData {
  condition: string;
  relationship: string;
  diagnosisAge?: number;
  outcome?: string;
  geneticTesting?: {
    done: boolean;
    result?: string;
    date?: string;
  };
}

// 免疫接种数据
export interface ImmunizationData {
  name: string;
  date: Date;
  dueDate?: Date;
  manufacturer?: string;
  lotNumber?: string;
  administeredBy?: string;
  location?: string;
  reactions?: string[];
}

// 手术数据
export interface SurgeryData {
  procedure: string;
  date: Date;
  surgeon: string;
  facility: string;
  outcome: string;
  complications?: string[];
  recovery?: {
    duration: number;
    notes: string;
  };
  followUp?: {
    required: boolean;
    date?: Date;
    provider?: string;
  };
}

// 实验室检查数据
export interface LabTestData {
  name: string;
  date: Date;
  results: {
    value: number | string;
    unit: string;
    referenceRange: string;
    flag?: 'normal' | 'high' | 'low' | 'critical';
  }[];
  orderedBy: string;
  facility: string;
  notes?: string;
}

// 评估结果
export interface AssessmentResult extends BaseData {
  assessmentType: 'vital-signs' | 'lifestyle' | 'comprehensive';
  scores: {
    overall: number;
    categories: {
      [key: string]: number;
    };
  };
  patterns?: {
    [key: string]: {
      type: string;
      frequency: string;
      significance: number;
      description: string;
    };
  };
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    reason: string;
    expectedBenefits: string[];
  }>;
  alerts?: Array<{
    type: 'warning' | 'critical';
    message: string;
    metric: string;
    value: number;
    threshold: number;
  }>;
  metadata: {
    modelVersion: string;
    confidenceScores: {
      [key: string]: number;
    };
    dataQuality: {
      featureNames: string[];
      normalizedRanges: {
        [key: string]: {
          min: number;
          max: number;
        };
      };
    };
  };
}

// 评估配置
export interface AssessmentConfig {
  thresholds: {
    [key: string]: {
      warning: {
        min?: number;
        max?: number;
      };
      critical: {
        min?: number;
        max?: number;
      };
    };
  };
  weights: {
    [key: string]: number;
  };
  recommendations: {
    maxCount: number;
    categories: string[];
  };
  patterns: {
    minSignificance: number;
    timeRanges: string[];
  };
}

// 健康数据聚合
export interface HealthData extends BaseData {
  vitalSigns: VitalSignsData;
  exercise?: ExerciseData[];
  nutrition?: NutritionData;
  sleep?: SleepData[];
  stress?: StressData[];
  medicalHistory?: MedicalHistoryData;
} 