import { Logger } from '../utils/logger';

const logger = new Logger('AIConfig');

export const aiConfig = {
  // DeepSeek配置
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: "deepseek-chat",
    defaultParams: {
      temperature: 0.5,
      maxTokens: 2000
    }
  },
  
  // 图像识别服务配置
  imageRecognition: {
    provider: process.env.VISION_API_PROVIDER || "baidu",
    apiKey: process.env.VISION_API_KEY,
    apiSecret: process.env.VISION_API_SECRET,
    supportedTypes: ["food", "exercise", "medical"],
    confidenceThreshold: 0.8
  },

  // 健康评估配置
  healthAssessment: {
    model: "deepseek-chat",
    evaluationFactors: ["vital_signs", "exercise", "diet", "sleep"],
    updateFrequency: "daily",
    cacheExpiry: 86400 // 24小时
  },

  // 推荐系统配置
  recommendation: {
    model: "deepseek-chat",
    types: ["diet", "exercise", "lifestyle"],
    refreshInterval: 3600,
    cacheEnabled: true
  },

  // 智能问答配置
  chatbot: {
    model: "deepseek-chat",
    supportedDomains: ["health", "medical", "lifestyle"],
    contextLength: 10,
    temperature: 0.7
  }
}; 