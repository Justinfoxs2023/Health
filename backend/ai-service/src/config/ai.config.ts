/**
 * @fileoverview TS 文件 ai.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const aiConfig = {
  models: {
    healthPrediction: {
      name: 'health-prediction',
      version: '1.0.0',
      endpoint: process.env.HEALTH_PREDICTION_ENDPOINT,
      apiKey: process.env.HEALTH_PREDICTION_API_KEY,
    },
    nutritionAnalysis: {
      name: 'nutrition-analysis',
      version: '1.0.0',
      endpoint: process.env.NUTRITION_ANALYSIS_ENDPOINT,
      apiKey: process.env.NUTRITION_ANALYSIS_API_KEY,
    },
    exerciseRecommendation: {
      name: 'exercise-recommendation',
      version: '1.0.0',
      endpoint: process.env.EXERCISE_RECOMMENDATION_ENDPOINT,
      apiKey: process.env.EXERCISE_RECOMMENDATION_API_KEY,
    },
  },
  services: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
    },
    tensorflow: {
      modelPath: process.env.TENSORFLOW_MODEL_PATH,
    },
  },
  cache: {
    predictionTTL: 3600,
    modelCacheTTL: 86400,
  },
  limits: {
    maxInputSize: 1024 * 1024, // 1MB
    maxBatchSize: 100,
    requestTimeout: 30000, // 30s
  },
};
