/**
 * @fileoverview TS 文件 development.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const developmentConfig = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/health_dev',
  },
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  logging: {
    level: 'debug',
    console: true,
    file: true,
  },
};
