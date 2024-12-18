/**
 * @fileoverview TS 文件 health-core.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 核心健康数据类型定义
 */

// 基础数据类型
export interface IBaseData {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
}

// 生命体征数据
export interface IVitalSignsData extends IBaseData {
  /** heartRate 的描述 */
  heartRate: number;
  /** bloodPressure 的描述 */
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  /** bodyTemperature 的描述 */
  bodyTemperature: number;
  /** respiratoryRate 的描述 */
  respiratoryRate: number;
  /** bloodOxygen 的描述 */
  bloodOxygen: number;
}

// 运动数据
export interface IExerciseData extends IBaseData {
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** caloriesBurned 的描述 */
  caloriesBurned?: number;
  /** heartRate 的描述 */
  heartRate?: {
    average: number;
    max: number;
    min: number;
  };
  /** steps 的描述 */
  steps?: number;
  /** distance 的描述 */
  distance?: number;
}

// 饮食数据
export interface INutritionData extends IBaseData {
  /** meals 的描述 */
  meals: IMealData[];
  /** waterIntake 的描述 */
  waterIntake: number;
  /** supplements 的描述 */
  supplements?: ISupplementData[];
}

// 餐食数据
export interface IMealData {
  /** type 的描述 */
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** foods 的描述 */
  foods: string[];
  /** nutrients 的描述 */
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    vitamins?: { [key: string]: number };
    minerals?: { [key: string]: number };
  };
  /** timestamp 的描述 */
  timestamp: Date;
  /** location 的描述 */
  location?: string;
  /** mood 的描述 */
  mood?: string;
}

// 营养补充剂数据
export interface ISupplementData {
  /** name 的描述 */
  name: string;
  /** dosage 的描述 */
  dosage: string;
  /** frequency 的描述 */
  frequency: string;
  /** purpose 的描述 */
  purpose: string;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate?: Date;
}

// 睡眠数据
export interface ISleepData extends IBaseData {
  /** duration 的描述 */
  duration: number;
  /** quality 的描述 */
  quality: number;
  /** startTime 的描述 */
  startTime: Date;
  /** endTime 的描述 */
  endTime: Date;
  /** stages 的描述 */
  stages?: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
  /** interruptions 的描述 */
  interruptions?: {
    count: number;
    totalDuration: number;
    reasons?: string[];
  };
  /** environmentalFactors 的描述 */
  environmentalFactors?: {
    temperature?: number;
    humidity?: number;
    noise?: number;
    light?: number;
  };
}

// 压力数据
export interface IStressData extends IBaseData {
  /** level 的描述 */
  level: number;
  /** symptoms 的描述 */
  symptoms: string[];
  /** triggers 的描述 */
  triggers?: string[];
  /** copingMechanisms 的描述 */
  copingMechanisms?: string[];
  /** duration 的描述 */
  duration?: number;
  /** impact 的描述 */
  impact?: {
    sleep?: number;
    appetite?: number;
    mood?: number;
    productivity?: number;
  };
}

// 医疗历史数据
export interface IMedicalHistoryData extends IBaseData {
  /** conditions 的描述 */
  conditions: IConditionData[];
  /** medications 的描述 */
  medications: IMedicationData[];
  /** allergies 的描述 */
  allergies: string[];
  /** familyHistory 的描述 */
  familyHistory: IFamilyHistoryData[];
  /** immunizations 的描述 */
  immunizations?: ImmunizationData[];
  /** surgeries 的描述 */
  surgeries?: ISurgeryData[];
  /** labTests 的描述 */
  labTests?: ILabTestData[];
}

// 疾病状况数据
export interface IConditionData {
  /** name 的描述 */
  name: string;
  /** diagnosisDate 的描述 */
  diagnosisDate: Date;
  /** status 的描述 */
  status: 'active' | 'resolved';
  /** severity 的描述 */
  severity?: 'mild' | 'moderate' | 'severe';
  /** symptoms 的描述 */
  symptoms?: string[];
  /** treatments 的描述 */
  treatments?: string[];
  /** specialists 的描述 */
  specialists?: string[];
  /** notes 的描述 */
  notes?: string;
}

// 药物数据
export interface IMedicationData {
  /** name 的描述 */
  name: string;
  /** dosage 的描述 */
  dosage: string;
  /** frequency 的描述 */
  frequency: string;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate?: Date;
  /** purpose 的描述 */
  purpose?: string;
  /** sideEffects 的描述 */
  sideEffects?: string[];
  /** effectiveness 的描述 */
  effectiveness?: number;
  /** prescribedBy 的描述 */
  prescribedBy?: string;
  /** interactions 的描述 */
  interactions?: string[];
}

// 家族病史数据
export interface IFamilyHistoryData {
  /** condition 的描述 */
  condition: string;
  /** relationship 的描述 */
  relationship: string;
  /** diagnosisAge 的描述 */
  diagnosisAge?: number;
  /** outcome 的描述 */
  outcome?: string;
  /** geneticTesting 的描述 */
  geneticTesting?: {
    done: boolean;
    result?: string;
    date?: string;
  };
}

// 免疫接种数据
export interface ImmunizationData {
  /** name 的描述 */
  name: string;
  /** date 的描述 */
  date: Date;
  /** dueDate 的描述 */
  dueDate?: Date;
  /** manufacturer 的描述 */
  manufacturer?: string;
  /** lotNumber 的描述 */
  lotNumber?: string;
  /** administeredBy 的描述 */
  administeredBy?: string;
  /** location 的描述 */
  location?: string;
  /** reactions 的描述 */
  reactions?: string[];
}

// 手术数据
export interface ISurgeryData {
  /** procedure 的描述 */
  procedure: string;
  /** date 的描述 */
  date: Date;
  /** surgeon 的描述 */
  surgeon: string;
  /** facility 的描述 */
  facility: string;
  /** outcome 的描述 */
  outcome: string;
  /** complications 的描述 */
  complications?: string[];
  /** recovery 的描述 */
  recovery?: {
    duration: number;
    notes: string;
  };
  /** followUp 的描述 */
  followUp?: {
    required: boolean;
    date?: Date;
    provider?: string;
  };
}

// 实验室检查数据
export interface ILabTestData {
  /** name 的描述 */
  name: string;
  /** date 的描述 */
  date: Date;
  /** results 的描述 */
  results: {
    value: number | string;
    unit: string;
    referenceRange: string;
    flag?: 'normal' | 'high' | 'low' | 'critical';
  }[];
  /** orderedBy 的描述 */
  orderedBy: string;
  /** facility 的描述 */
  facility: string;
  /** notes 的描述 */
  notes?: string;
}

// 评估结果
export interface IAssessmentResult extends IBaseData {
  /** assessmentType 的描述 */
  assessmentType: 'vital-signs' | 'lifestyle' | 'comprehensive';
  /** scores 的描述 */
  scores: {
    overall: number;
    categories: {
      [key: string]: number;
    };
  };
  /** patterns 的描述 */
  patterns?: {
    [key: string]: {
      type: string;
      frequency: string;
      significance: number;
      description: string;
    };
  };
  /** recommendations 的描述 */
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    reason: string;
    expectedBenefits: string[];
  }>;
  /** alerts 的描述 */
  alerts?: Array<{
    type: 'warning' | 'critical';
    message: string;
    metric: string;
    value: number;
    threshold: number;
  }>;
  /** metadata 的描述 */
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
export interface IAssessmentConfig {
  /** thresholds 的描述 */
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
  /** weights 的描述 */
  weights: {
    [key: string]: number;
  };
  /** recommendations 的描述 */
  recommendations: {
    maxCount: number;
    categories: string[];
  };
  /** patterns 的描述 */
  patterns: {
    minSignificance: number;
    timeRanges: string[];
  };
}

// 健康数据聚合
export interface IHealthData extends IBaseData {
  /** vitalSigns 的描述 */
  vitalSigns: IVitalSignsData;
  /** exercise 的描述 */
  exercise?: IExerciseData[];
  /** nutrition 的描述 */
  nutrition?: INutritionData;
  /** sleep 的描述 */
  sleep?: ISleepData[];
  /** stress 的描述 */
  stress?: IStressData[];
  /** medicalHistory 的描述 */
  medicalHistory?: IMedicalHistoryData;
}
