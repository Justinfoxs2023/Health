// 智能分析配置
export interface AnalyticsConfig {
  // 基础配置
  enabled: boolean;
  sampleRate: number;  // 采样率
  interval: number;    // 分析间隔(ms)
  
  // 数据源配置
  dataSources: {
    performance: boolean;  // 性能数据
    behavior: boolean;     // 行为数据
    health: boolean;       // 健康数据
    environment: boolean;  // 环境数据
  };

  // AI模型配置
  ai: {
    enabled: boolean;
    modelType: 'basic' | 'advanced' | 'expert';
    confidenceThreshold: number;  // 置信度阈值
    updateInterval: number;       // 模型更新间隔
  };

  // 预警配置
  alerts: {
    enabled: boolean;
    levels: {
      warning: number;
      critical: number;
    };
    channels: Array<'app' | 'email' | 'sms' | 'push'>;
  };
}

// 用户画像
export interface UserProfile {
  // 基础信息
  id: string;
  createdAt: Date;
  lastActive: Date;

  // 健康特征
  healthMetrics: {
    basicStats: {
      height: number;
      weight: number;
      age: number;
      gender: string;
    };
    vitalSigns: {
      bloodPressure: number[];
      heartRate: number;
      temperature: number;
    };
    conditions: string[];  // 健康状况
    medications: string[]; // 用药情况
  };

  // 行为特征
  behaviorPatterns: {
    activityLevel: number;     // 活动水平
    sleepQuality: number;      // 睡眠质量
    dietaryHabits: string[];   // 饮食习惯
    exerciseRoutine: string[]; // 运动习惯
    stressLevel: number;       // 压力水平
  };

  // 使用习惯
  usagePatterns: {
    preferredFeatures: string[];    // 常用功能
    interactionTimes: number[];     // 使用时段
    sessionDuration: number;        // 平均会话时长
    responseToSuggestions: number;  // 建议采纳率
  };

  // 个性化偏好
  preferences: {
    notifications: {
      enabled: boolean;
      types: string[];
      frequency: 'low' | 'medium' | 'high';
    };
    dataSharing: {
      level: 'minimal' | 'standard' | 'full';
      thirdPartyConsent: boolean;
    };
    accessibility: {
      fontSize: number;
      contrast: number;
      animations: boolean;
    };
  };
}

// 分析结果
export interface AnalyticsResult {
  timestamp: Date;
  userId: string;

  // 健康风险评估
  healthRisks: Array<{
    type: string;
    level: 'low' | 'medium' | 'high';
    probability: number;
    factors: string[];
    recommendations: string[];
  }>;

  // 行为分析
  behaviorInsights: Array<{
    category: string;
    pattern: string;
    impact: 'positive' | 'neutral' | 'negative';
    suggestions: string[];
  }>;

  // 预测分析
  predictions: Array<{
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    timeframe: string;
    influencingFactors: string[];
  }>;

  // 个性化建议
  recommendations: Array<{
    type: string;
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    expectedBenefits: string[];
    implementation: {
      difficulty: 'easy' | 'moderate' | 'challenging';
      timeRequired: string;
      steps: string[];
    };
  }>;

  // 场景分析
  contextualInsights: {
    currentContext: {
      location: string;
      activity: string;
      environmentalFactors: string[];
    };
    relevantSuggestions: Array<{
      trigger: string;
      action: string;
      timing: string;
      appropriateness: number;
    }>;
  };
}

// AI模型性能指标
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  latency: number;
  predictionConfidence: number;
  dataQuality: {
    completeness: number;
    consistency: number;
    accuracy: number;
  };
} 