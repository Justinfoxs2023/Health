/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 智能分析配置
export interface IAnalyticsConfig {
   
  /** enabled 的描述 */
    enabled: false | true;
  /** sampleRate 的描述 */
    sampleRate: number;  
  /** interval 的描述 */
    interval: number;  /** ms 的描述 */
    /** ms 的描述 */
    ms

   
  /** dataSources 的描述 */
    dataSources: {
    performance: boolean;  
    behavior: boolean;  
    health: boolean;  
    environment: boolean;  
  };

  // AI模型配置
  /** ai 的描述 */
    ai: {
    enabled: boolean;
    modelType: 'basic' | 'advanced' | 'expert';
    confidenceThreshold: number; // 置信度阈值
    updateInterval: number; // 模型更新间隔
  };

  // 预警配置
  /** alerts 的描述 */
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
export interface IUserProfile {
   
  /** id 的描述 */
    id: string;
  /** createdAt 的描述 */
    createdAt: Date;
  /** lastActive 的描述 */
    lastActive: Date;

   
  /** healthMetrics 的描述 */
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
    conditions: string[]; // 健康状况
    medications: string[]; // 用药情况
  };

  // 行为特征
  /** behaviorPatterns 的描述 */
    behaviorPatterns: {
    activityLevel: number; // 活动水平
    sleepQuality: number; // 睡眠质量
    dietaryHabits: string[]; // 饮食习惯
    exerciseRoutine: string[]; // 运动习惯
    stressLevel: number; // 压力水平
  };

  // 使用习惯
  /** usagePatterns 的描述 */
    usagePatterns: {
    preferredFeatures: string[]; // 常用功能
    interactionTimes: number[]; // 使用时段
    sessionDuration: number; // 平均会话时长
    responseToSuggestions: number; // 建议采纳率
  };

  // 个性化偏好
  /** preferences 的描述 */
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
export interface IAnalyticsResult {
  /** timestamp 的描述 */
    timestamp: Date;
  /** userId 的描述 */
    userId: string;

   
  /** healthRisks 的描述 */
    healthRisks: Array{
    type: string;
    level: low  medium  high;
    probability: number;
    factors: string;
    recommendations: string;
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
export interface IModelMetrics {
  /** accuracy 的描述 */
    accuracy: number;
  /** precision 的描述 */
    precision: number;
  /** recall 的描述 */
    recall: number;
  /** f1Score 的描述 */
    f1Score: number;
  /** confusionMatrix 的描述 */
    confusionMatrix: number;
  /** latency 的描述 */
    latency: number;
  /** predictionConfidence 的描述 */
    predictionConfidence: number;
  /** dataQuality 的描述 */
    dataQuality: {
    completeness: number;
    consistency: number;
    accuracy: number;
  };
}
