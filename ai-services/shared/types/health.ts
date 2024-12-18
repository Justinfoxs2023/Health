/**
 * @fileoverview TS 文件 health.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 生命体征数据接口
 */
export interface IVitalSignsData {
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
  /** timestamp 的描述 */
  timestamp?: string;
}

/**
 * 生活方式数据接口
 */
export interface ILifestyleData {
  /** exercise 的描述 */
  exercise: IExerciseData[];
  /** diet 的描述 */
  diet: IDietData;
  /** sleep 的描述 */
  sleep: ISleepData[];
  /** stress 的描述 */
  stress: IStressData[];
  /** timestamp 的描述 */
  timestamp: string;
}

/**
 * 运动数据接口
 */
export interface IExerciseData {
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** timestamp 的描述 */
  timestamp: string;
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

/**
 * 饮食数据接口
 */
export interface IDietData {
  /** meals 的描述 */
  meals: IMealData[];
  /** waterIntake 的描述 */
  waterIntake: number;
  /** supplements 的描述 */
  supplements?: ISupplementData[];
}

/**
 * 餐食数据接口
 */
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
  timestamp: string;
  /** location 的描述 */
  location?: string;
  /** mood 的描述 */
  mood?: string;
}

/**
 * 营养补充剂数据接口
 */
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
  startDate: string;
  /** endDate 的描述 */
  endDate?: string;
}

/**
 * 睡眠数据接口
 */
export interface ISleepData {
  /** duration 的描述 */
  duration: number;
  /** quality 的描述 */
  quality: number;
  /** startTime 的描述 */
  startTime: string;
  /** endTime 的描述 */
  endTime: string;
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

/**
 * 压力数据接口
 */
export interface IStressData {
  /** level 的描述 */
  level: number;
  /** symptoms 的描述 */
  symptoms: string[];
  /** timestamp 的描述 */
  timestamp: string;
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

/**
 * 医疗历史数据接口
 */
export interface IMedicalHistoryData {
  /** conditions 的描述 */
  conditions: IConditionData[];
  /** medications 的描述 */
  medications: IMedicationData[];
  /** allergies 的描述 */
  allergies: string[];
  /** familyHistory 的描述 */
  familyHistory: IFamilyHistoryData[];
  /** immunizations 的描述 */
  immunizations?: IImmunizationData[];
  /** surgeries 的描述 */
  surgeries?: ISurgeryData[];
  /** labTests 的描述 */
  labTests?: ILabTestData[];
}

/**
 * 疾病状况数据接口
 */
export interface IConditionData {
  /** name 的描述 */
  name: string;
  /** diagnosisDate 的描述 */
  diagnosisDate: string;
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

/**
 * 药物数据接口
 */
export interface IMedicationData {
  /** name 的描述 */
  name: string;
  /** dosage 的描述 */
  dosage: string;
  /** frequency 的描述 */
  frequency: string;
  /** startDate 的描述 */
  startDate: string;
  /** endDate 的描述 */
  endDate?: string;
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

/**
 * 家族病史数据接口
 */
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

/**
 * 免疫接种数据接口
 */
export interface IImmunizationData {
  /** name 的描述 */
  name: string;
  /** date 的描述 */
  date: string;
  /** dueDate 的描述 */
  dueDate?: string;
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

/**
 * 手术数据接口
 */
export interface ISurgeryData {
  /** procedure 的描述 */
  procedure: string;
  /** date 的描述 */
  date: string;
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
    date?: string;
    provider?: string;
  };
}

/**
 * 实验室检查数据接口
 */
export interface ILabTestData {
  /** name 的描述 */
  name: string;
  /** date 的描述 */
  date: string;
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

/**
 * 评估结果接口
 */
export interface IAssessmentResult {
  /** score 的描述 */
  score: number;
  /** timestamp 的描述 */
  timestamp: string;
  /** category 的描述 */
  category: string;
  /** details 的描述 */
  details: any;
  /** risks 的描述 */
  risks?: any[];
  /** recommendations 的描述 */
  recommendations?: string[];
  /** patterns 的描述 */
  patterns?: any[];
  /** riskFactors 的描述 */
  riskFactors?: any[];
  /** trends 的描述 */
  trends?: any[];
}

/**
 * 标准化数据接口
 */
export interface INormalizedData {
  [key: string]: number | { [key: string]: number };
}

/**
 * 模式分析接口
 */
export interface IPatternAnalysis {
  /** patterns 的描述 */
  patterns: any[];
  /** confidence 的描述 */
  confidence: number;
  /** timeRange 的描述 */
  timeRange: {
    start: string;
    end: string;
  };
}

/**
 * 建议接口
 */
export interface IRecommendations {
  /** items 的描述 */
  items: string[];
  /** priority 的描述 */
  priority: number;
  /** context 的描述 */
  context: {
    patterns: any[];
    confidence: number;
  };
}

/**
 * 风险因素接口
 */
export interface IRiskFactors {
  /** factors 的描述 */
  factors: any[];
  /** severity 的描述 */
  severity: 'low' | 'medium' | 'high';
  /** confidence 的描述 */
  confidence: number;
}

/**
 * 趋势预测接口
 */
export interface ITrendPrediction {
  /** predictions 的描述 */
  predictions: any[];
  /** confidence 的描述 */
  confidence: number;
  /** horizon 的描述 */
  horizon: string;
}

/**
 * 健康评估接口
 */
export interface IHealthAssessment {
  /** vitalSigns 的描述 */
  vitalSigns: {
    assess(data: IVitalSignsData): Promise<IAssessmentResult>;
    validate(data: IVitalSignsData): boolean;
    normalize(data: IVitalSignsData): INormalizedData;
  };
  /** lifestyle 的描述 */
  lifestyle: {
    assess(data: ILifestyleData): Promise<IAssessmentResult>;
    analyzePattern(data: ILifestyleData[]): Promise<IPatternAnalysis>;
    generateRecommendations(analysis: IPatternAnalysis): Promise<IRecommendations>;
  };
  /** medicalHistory 的描述 */
  medicalHistory: {
    assess(data: IMedicalHistoryData): Promise<IAssessmentResult>;
    calculateRiskFactors(data: IMedicalHistoryData): Promise<IRiskFactors>;
    predictTrends(data: IMedicalHistoryData[]): Promise<ITrendPrediction>;
  };
}
