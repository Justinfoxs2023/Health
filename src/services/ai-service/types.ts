/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// AI服务基础类型
export interface IAIServiceConfig {
  /** modelPath 的描述 */
    modelPath: string;
  /** apiEndpoint 的描述 */
    apiEndpoint: string;
  /** apiKey 的描述 */
    apiKey: string;
  /** batchSize 的描述 */
    batchSize: number;
  /** threshold 的描述 */
    threshold: number;
}

// 图像识别类型
export interface ImageRecognitionResult {
   
  /** foodRecognition 的描述 */
    foodRecognition: {
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
  /** poseRecognition 的描述 */
    poseRecognition?: undefined | { pose: string; accuracy: number; keyPoints: { part: string; position: { x: number; y: number; }; score: number; }[]; corrections: string[]; };
}

// 实时分析类型
export interface IRealTimeAnalysis {
   
  /** poseAnalysis 的描述 */
    poseAnalysis: {
    currentPose: string;
    isCorrect: boolean;
    corrections: string;
    riskLevel: low  medium  high;
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
export interface IPersonalizedModel {
  /** userId 的描述 */
    userId: string;
  /** modelType 的描述 */
    modelType: diet  exercise  health;
  parameters: Recordstring, number;
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
export interface IMultiModalAnalysis {
   
  /** speech 的描述 */
    speech: {
    text: string;
    intent: string;
    sentiment: positive  neutral  negative;
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
