/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/** 健康数据类型定义 */

// 生命体征数据
export interface IVitalSigns {
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

// 生活方式数据
export interface ILifestyle {
  /** exercise 的描述 */
  exercise: {
    type: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
    timestamp: string;
  }[];
  /** diet 的描述 */
  diet: {
    meals: {
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      foods: string[];
      nutrients: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      timestamp: string;
    }[];
    waterIntake: number;
  };
  /** sleep 的描述 */
  sleep: {
    duration: number;
    quality: number;
    startTime: string;
    endTime: string;
  }[];
  /** stress 的描述 */
  stress: {
    level: number;
    symptoms: string[];
    timestamp: string;
  }[];
}

// 医疗历史数据
export interface IMedicalHistory {
  /** conditions 的描述 */
  conditions: {
    name: string;
    diagnosisDate: string;
    status: 'active' | 'resolved';
  }[];
  /** medications 的描述 */
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }[];
  /** allergies 的描述 */
  allergies: string[];
  /** familyHistory 的描述 */
  familyHistory: {
    condition: string;
    relationship: string;
  }[];
}

// 健康评估结果
export interface IHealthAssessment {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: string;
  /** overallScore 的描述 */
  overallScore: number;
  /** categories 的描述 */
  categories: {
    vitalSigns: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    lifestyle: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    medical: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
  };
  /** risks 的描述 */
  risks: {
    level: 'low' | 'medium' | 'high';
    type: string;
    description: string;
    recommendations: string[];
  }[];
}

// 健康推荐
export interface IHealthRecommendation {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: string;
  /** recommendations 的描述 */
  recommendations: {
    category: 'exercise' | 'diet' | 'sleep' | 'stress' | 'medical';
    priority: number;
    title: string;
    description: string;
    actions: string[];
    expectedBenefits: string[];
  }[];
}

// 分析结果
export interface IAnalyticsResult {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: string;
  /** timeSeriesAnalysis 的描述 */
  timeSeriesAnalysis: {
    trends: {
      metric: string;
      trend: 'increasing' | 'decreasing' | 'stable';
      confidence: number;
    }[];
    seasonality: {
      metric: string;
      pattern: string;
      confidence: number;
    }[];
  };
  /** patterns 的描述 */
  patterns: {
    type: string;
    description: string;
    significance: number;
    relatedMetrics: string[];
  }[];
  /** predictions 的描述 */
  predictions: {
    metric: string;
    value: number;
    confidence: number;
    horizon: string;
  }[];
}

// AI模型类型
export interface IAIModel {
  /** modelType 的描述 */
  modelType: string;
  /** version 的描述 */
  version: string;
  /** lastUpdated 的描述 */
  lastUpdated: string;
  /** metrics 的描述 */
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

// 计算任务
export interface IComputeTask {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: 'assessment' | 'recommendation' | 'analysis';
  /** priority 的描述 */
  priority: number;
  /** data 的描述 */
  data: any;
  /** status 的描述 */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  /** startTime 的描述 */
  startTime?: string;
  /** endTime 的描述 */
  endTime?: string;
  /** error 的描述 */
  error?: string;
}
