export const developmentConfig = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/health_dev'
  },
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379'
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY
  },
  logging: {
    level: 'debug',
    console: true,
    file: true
  }
}; 