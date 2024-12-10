// AI功能类型枚举
export enum AIFeatureType {
    FOOD_RECOGNITION = 'food_recognition',    // 食物识别
    POSE_DETECTION = 'pose_detection',        // 姿态检测
    HEALTH_ASSESSMENT = 'health_assessment',  // 健康评估
    DIET_RECOMMENDATION = 'diet_recommendation', // 饮食推荐
    EXERCISE_PLANNING = 'exercise_planning',   // 运动规划
    CHAT_BOT = 'chat_bot',                    // 健康咨询机器人
    EMOTION_ANALYSIS = 'emotion_analysis'      // 情绪分析
  }
  
  // AI模型来源
  export enum AIModelSource {
    LOCAL = 'local',          // 本地模型
    CLOUD = 'cloud',          // 云端模型
    EDGE = 'edge',            // 边缘设备
    HYBRID = 'hybrid'         // 混合模式
  }
  
  // AI功能配置接口
  export interface AIFeatureConfig {
    type: AIFeatureType;
    enabled: boolean;
    modelSource: AIModelSource;
    modelVersion: string;
    apiEndpoint?: string;
    apiKey?: string;
    maxConcurrentRequests: number;
    timeout: number;          // 超时时间(ms)
    cacheEnabled: boolean;    // 是否启用缓存
    cacheDuration: number;    // 缓存时间(s)
    costPerRequest: number;   // 每次请求成本
    dailyRequestLimit: number;// 每日请求限制
    accuracy: number;         // 准确度要求(0-1)
  }
  
  // AI性能指标接口
  export interface AIPerformanceMetrics {
    averageResponseTime: number;
    requestSuccess: number;
    requestFailed: number;
    totalCost: number;
    accuracyRate: number;
    lastUpdated: Date;
  }
  
  // AI功能使用统计
  export interface AIUsageStats {
    featureType: AIFeatureType;
    dailyRequests: number;
    monthlyRequests: number;
    averageLatency: number;
    errorRate: number;
    costIncurred: number;
    lastUsed: Date;
  }