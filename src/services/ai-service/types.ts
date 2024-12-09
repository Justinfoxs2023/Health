// AI服务基础类型
export interface AIServiceConfig {
  modelPath: string;
  apiEndpoint: string;
  apiKey: string;
  batchSize: number;
  threshold: number;
}

// 图像识别类型
export interface ImageRecognitionResult {
  // 食物识别
  foodRecognition?: {
    foodName: string;
    confidence: number;
    nutritionInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    suggestions: string[];
  };

  // 运动姿态识别
  poseRecognition?: {
    pose: string;
    accuracy: number;
    keyPoints: Array<{
      part: string;
      position: { x: number; y: number };
      score: number;
    }>;
    corrections: string[];
  };
}

// 实时分析类型
export interface RealTimeAnalysis {
  // 实时姿态分析
  poseAnalysis: {
    currentPose: string;
    isCorrect: boolean;
    corrections: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };

  // 实时健康指标
  healthMetrics: {
    heartRate?: number;
    caloriesBurned?: number;
    intensity?: 'low' | 'medium' | 'high';
    warning?: string;
  };
}

// 个性化AI模型
export interface PersonalizedModel {
  userId: string;
  modelType: 'diet' | 'exercise' | 'health';
  parameters: Record<string, number>;
  performance: {
    accuracy: number;
    lastUpdated: Date;
    iterations: number;
  };
  preferences: {
    learningRate: number;
    features: string[];
    constraints: Record<string, any>;
  };
}

// 多模态分析结果
export interface MultiModalAnalysis {
  // 语音分析
  speech?: {
    text: string;
    intent: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };

  // 情绪分析
  emotion?: {
    primary: string;
    intensity: number;
    related: string[];
    suggestions: string[];
  };

  // 综合建议
  recommendations: Array<{
    type: string;
    content: string;
    priority: number;
    context: Record<string, any>;
  }>;
} 