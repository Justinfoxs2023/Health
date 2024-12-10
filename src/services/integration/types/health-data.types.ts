// 健康数据集成
export interface HealthDataIntegration extends BaseHealthData {
  // 基础健康数据
  basicHealth: {
    height: number;
    weight: number;
    bmi: number;
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
  };

  // 生命体征数据
  vitalSigns: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
      timestamp: Date;
    }[];
    heartRate: {
      value: number;
      timestamp: Date;
    }[];
    bodyTemperature: {
      value: number;
      timestamp: Date;
    }[];
    respiratoryRate: {
      value: number;
      timestamp: Date;
    }[];
    bloodOxygen: {
      value: number;
      timestamp: Date;
    }[];
  };

  // 运动数据
  exerciseData: {
    dailySteps: number;
    activeMinutes: number;
    caloriesBurned: number;
    workouts: Array<{
      type: string;
      duration: number;
      intensity: string;
      caloriesBurned: number;
      timestamp: Date;
    }>;
  };

  // 睡眠数据
  sleepData: {
    totalDuration: number;
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
    awakeTime: number;
    sleepQuality: number;
    startTime: Date;
    endTime: Date;
  };

  // 营养数据
  nutritionData: {
    caloriesIntake: number;
    macronutrients: {
      protein: number;
      carbs: number;
      fat: number;
    };
    micronutrients: Record<string, number>;
    waterIntake: number;
    meals: Array<{
      type: string;
      foods: string[];
      nutrients: Record<string, number>;
      timestamp: Date;
    }>;
  };

  // 情绪数据
  moodData: {
    currentMood: string;
    stressLevel: number;
    energyLevel: number;
    notes: string;
    timestamp: Date;
  };
}

// 健康数据分析
export interface HealthDataAnalysis {
  // 趋势分析
  trends: {
    vitalSigns: TrendAnalysis;
    exercise: TrendAnalysis;
    nutrition: TrendAnalysis;
    sleep: TrendAnalysis;
    mood: TrendAnalysis;
  };

  // 相关性分析
  correlations: Array<{
    factors: string[];
    strength: number;
    direction: 'positive' | 'negative';
    confidence: number;
  }>;

  // 健康评分
  healthScores: {
    overall: number;
    physical: number;
    mental: number;
    nutrition: number;
    lifestyle: number;
  };

  // 风险评估
  riskAssessment: {
    currentRisks: HealthRisk[];
    potentialRisks: HealthRisk[];
    preventiveMeasures: string[];
  };

  // 建议
  recommendations: {
    immediate: ActionRecommendation[];
    shortTerm: ActionRecommendation[];
    longTerm: ActionRecommendation[];
  };
}

// 趋势分析
export interface TrendAnalysis {
  period: string;
  data: Array<{
    metric: string;
    values: number[];
    trend: 'increasing' | 'decreasing' | 'stable';
    significance: number;
  }>;
  insights: string[];
}

// 行动建议
export interface ActionRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  expectedBenefits: string[];
  timeframe: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  resources: string[];
}

// 健康数据同步配置
export interface HealthDataSyncConfig {
  sources: Array<{
    type: string;
    provider: string;
    lastSync: Date;
    syncFrequency: string;
    dataTypes: string[];
  }>;
  
  preferences: {
    autoSync: boolean;
    syncInterval: number;
    dataPriority: Record<string, number>;
  };

  validation: {
    rules: ValidationRule[];
    conflictResolution: string;
    qualityThresholds: Record<string, number>;
  };
}

// 数据验证规则
export interface ValidationRule {
  dataType: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  action: 'accept' | 'reject' | 'flag';
  message?: string;
} 