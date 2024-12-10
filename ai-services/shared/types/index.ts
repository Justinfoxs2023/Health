/** 健康数据类型定义 */

// 生命体征数据
export interface VitalSigns {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature: number;
  respiratoryRate: number;
  bloodOxygen: number;
}

// 生活方式数据
export interface Lifestyle {
  exercise: {
    type: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
    timestamp: string;
  }[];
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
  sleep: {
    duration: number;
    quality: number;
    startTime: string;
    endTime: string;
  }[];
  stress: {
    level: number;
    symptoms: string[];
    timestamp: string;
  }[];
}

// 医疗历史数据
export interface MedicalHistory {
  conditions: {
    name: string;
    diagnosisDate: string;
    status: 'active' | 'resolved';
  }[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }[];
  allergies: string[];
  familyHistory: {
    condition: string;
    relationship: string;
  }[];
}

// 健康评估结果
export interface HealthAssessment {
  userId: string;
  timestamp: string;
  overallScore: number;
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
  risks: {
    level: 'low' | 'medium' | 'high';
    type: string;
    description: string;
    recommendations: string[];
  }[];
}

// 健康推荐
export interface HealthRecommendation {
  userId: string;
  timestamp: string;
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
export interface AnalyticsResult {
  userId: string;
  timestamp: string;
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
  patterns: {
    type: string;
    description: string;
    significance: number;
    relatedMetrics: string[];
  }[];
  predictions: {
    metric: string;
    value: number;
    confidence: number;
    horizon: string;
  }[];
}

// AI模型类型
export interface AIModel {
  modelType: string;
  version: string;
  lastUpdated: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

// 计算任务
export interface ComputeTask {
  id: string;
  type: 'assessment' | 'recommendation' | 'analysis';
  priority: number;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  error?: string;
} 