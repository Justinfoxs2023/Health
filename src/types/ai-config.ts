/**
 * @fileoverview TS 文件 ai-config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// AI功能类型枚举
export enum AIFeatureType {
  FOOD_RECOGNITION = 'food_recognition', // 食物识别
  POSE_DETECTION = 'pose_detection', // 姿态检测
  HEALTH_ASSESSMENT = 'health_assessment', // 健康评估
  DIET_RECOMMENDATION = 'diet_recommendation', // 饮食推荐
  EXERCISE_PLANNING = 'exercise_planning', // 运动规划
  CHAT_BOT = 'chat_bot', // 健康咨询机器人
  EMOTION_ANALYSIS = 'emotion_analysis', // 情绪分析
}

// AI模型来源
export enum AIModelSource {
  LOCAL = 'local', // 本地模型
  CLOUD = 'cloud', // 云端模型
  EDGE = 'edge', // 边缘设备
  HYBRID = 'hybrid', // 混合模式
}

// AI功能配置接口
export interface IAIFeatureConfig {
  /** type 的描述 */
  type: import("D:/Health/src/types/ai-config").AIFeatureType.FOOD_RECOGNITION | import("D:/Health/src/types/ai-config").AIFeatureType.POSE_DETECTION | import("D:/Health/src/types/ai-config").AIFeatureType.HEALTH_ASSESSMENT | import("D:/Health/src/types/ai-config").AIFeatureType.DIET_RECOMMENDATION | import("D:/Health/src/types/ai-config").AIFeatureType.EXERCISE_PLANNING | import("D:/Health/src/types/ai-config").AIFeatureType.CHAT_BOT | import("D:/Health/src/types/ai-config").AIFeatureType.EMOTION_ANALYSIS;
  /** enabled 的描述 */
  enabled: false | true;
  /** modelSource 的描述 */
  modelSource: import("D:/Health/src/types/ai-config").AIModelSource.LOCAL | import("D:/Health/src/types/ai-config").AIModelSource.CLOUD | import("D:/Health/src/types/ai-config").AIModelSource.EDGE | import("D:/Health/src/types/ai-config").AIModelSource.HYBRID;
  /** modelVersion 的描述 */
  modelVersion: string;
  /** apiEndpoint 的描述 */
  apiEndpoint: string;
  /** apiKey 的描述 */
  apiKey: string;
  /** maxConcurrentRequests 的描述 */
  maxConcurrentRequests: number;
  /** timeout 的描述 */
  timeout: number /** ms 的描述 */;
  /** ms 的描述 */
  ms;
  /** cacheEnabled 的描述 */
  cacheEnabled: false | true;
  /** cacheDuration 的描述 */
  cacheDuration: number /** s 的描述 */;
  /** s 的描述 */
  s;
  /** costPerRequest 的描述 */
  costPerRequest: number;
  /** dailyRequestLimit 的描述 */
  dailyRequestLimit: number;
  /** accuracy 的描述 */
  accuracy: number /** 01 的描述 */;
  /** 01 的描述 */
  01;
}

// AI性能指标接口
export interface IAIPerformanceMetrics {
  /** averageResponseTime 的描述 */
  averageResponseTime: number;
  /** requestSuccess 的描述 */
  requestSuccess: number;
  /** requestFailed 的描述 */
  requestFailed: number;
  /** totalCost 的描述 */
  totalCost: number;
  /** accuracyRate 的描述 */
  accuracyRate: number;
  /** lastUpdated 的描述 */
  lastUpdated: Date;
}

// AI功能使用统计
export interface IAIUsageStats {
  /** featureType 的描述 */
  featureType: import("D:/Health/src/types/ai-config").AIFeatureType.FOOD_RECOGNITION | import("D:/Health/src/types/ai-config").AIFeatureType.POSE_DETECTION | import("D:/Health/src/types/ai-config").AIFeatureType.HEALTH_ASSESSMENT | import("D:/Health/src/types/ai-config").AIFeatureType.DIET_RECOMMENDATION | import("D:/Health/src/types/ai-config").AIFeatureType.EXERCISE_PLANNING | import("D:/Health/src/types/ai-config").AIFeatureType.CHAT_BOT | import("D:/Health/src/types/ai-config").AIFeatureType.EMOTION_ANALYSIS;
  /** dailyRequests 的描述 */
  dailyRequests: number;
  /** monthlyRequests 的描述 */
  monthlyRequests: number;
  /** averageLatency 的描述 */
  averageLatency: number;
  /** errorRate 的描述 */
  errorRate: number;
  /** costIncurred 的描述 */
  costIncurred: number;
  /** lastUsed 的描述 */
  lastUsed: Date;
}
