/**
 * 生命体征数据接口
 */
export interface IVitalSignsData {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature: number;
  respiratoryRate: number;
  bloodOxygen: number;
  timestamp?: string;
}

/**
 * 生活方式数据接口
 */
export interface ILifestyleData {
  exercise: IExerciseData[];
  diet: IDietData;
  sleep: ISleepData[];
  stress: IStressData[];
  timestamp: string;
}

/**
 * 运动数据接口
 */
export interface IExerciseData {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  timestamp: string;
  caloriesBurned?: number;
  heartRate?: {
    average: number;
    max: number;
    min: number;
  };
  steps?: number;
  distance?: number;
}

/**
 * 饮食数据接口
 */
export interface IDietData {
  meals: IMealData[];
  waterIntake: number;
  supplements?: ISupplementData[];
}

/**
 * 餐食数据接口
 */
export interface IMealData {
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
  timestamp: string;
  location?: string;
  mood?: string;
}

/**
 * 营养补充剂数据接口
 */
export interface ISupplementData {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  startDate: string;
  endDate?: string;
}

/**
 * 睡眠数据接口
 */
export interface ISleepData {
  duration: number;
  quality: number;
  startTime: string;
  endTime: string;
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

/**
 * 压力数据接口
 */
export interface IStressData {
  level: number;
  symptoms: string[];
  timestamp: string;
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

/**
 * 医疗历史数据接口
 */
export interface IMedicalHistoryData {
  conditions: IConditionData[];
  medications: IMedicationData[];
  allergies: string[];
  familyHistory: IFamilyHistoryData[];
  immunizations?: IImmunizationData[];
  surgeries?: ISurgeryData[];
  labTests?: ILabTestData[];
}

/**
 * 疾病状况数据接口
 */
export interface IConditionData {
  name: string;
  diagnosisDate: string;
  status: 'active' | 'resolved';
  severity?: 'mild' | 'moderate' | 'severe';
  symptoms?: string[];
  treatments?: string[];
  specialists?: string[];
  notes?: string;
}

/**
 * 药物数据接口
 */
export interface IMedicationData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  purpose?: string;
  sideEffects?: string[];
  effectiveness?: number;
  prescribedBy?: string;
  interactions?: string[];
}

/**
 * 家族病史数据接口
 */
export interface IFamilyHistoryData {
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

/**
 * 免疫接种数据接口
 */
export interface IImmunizationData {
  name: string;
  date: string;
  dueDate?: string;
  manufacturer?: string;
  lotNumber?: string;
  administeredBy?: string;
  location?: string;
  reactions?: string[];
}

/**
 * 手术数据接口
 */
export interface ISurgeryData {
  procedure: string;
  date: string;
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
    date?: string;
    provider?: string;
  };
}

/**
 * 实验室检查数据接口
 */
export interface ILabTestData {
  name: string;
  date: string;
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

/**
 * 评估结果接口
 */
export interface IAssessmentResult {
  score: number;
  timestamp: string;
  category: string;
  details: any;
  risks?: any[];
  recommendations?: string[];
  patterns?: any[];
  riskFactors?: any[];
  trends?: any[];
}

/**
 * 标准化数据接口
 */
export interface INormalizedData {
  [key: string]: number | {[key: string]: number};
}

/**
 * 模式分析接口
 */
export interface IPatternAnalysis {
  patterns: any[];
  confidence: number;
  timeRange: {
    start: string;
    end: string;
  };
}

/**
 * 建议接口
 */
export interface IRecommendations {
  items: string[];
  priority: number;
  context: {
    patterns: any[];
    confidence: number;
  };
}

/**
 * 风险因素接口
 */
export interface IRiskFactors {
  factors: any[];
  severity: 'low' | 'medium' | 'high';
  confidence: number;
}

/**
 * 趋势预测接口
 */
export interface ITrendPrediction {
  predictions: any[];
  confidence: number;
  horizon: string;
}

/**
 * 健康评估接口
 */
export interface IHealthAssessment {
  vitalSigns: {
    assess(data: IVitalSignsData): Promise<IAssessmentResult>;
    validate(data: IVitalSignsData): boolean;
    normalize(data: IVitalSignsData): INormalizedData;
  };
  lifestyle: {
    assess(data: ILifestyleData): Promise<IAssessmentResult>;
    analyzePattern(data: ILifestyleData[]): Promise<IPatternAnalysis>;
    generateRecommendations(analysis: IPatternAnalysis): Promise<IRecommendations>;
  };
  medicalHistory: {
    assess(data: IMedicalHistoryData): Promise<IAssessmentResult>;
    calculateRiskFactors(data: IMedicalHistoryData): Promise<IRiskFactors>;
    predictTrends(data: IMedicalHistoryData[]): Promise<ITrendPrediction>;
  };
} 