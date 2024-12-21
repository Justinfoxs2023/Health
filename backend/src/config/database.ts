import mongoose from 'mongoose';
import { logger } from '../services/logger';

const dbConfig = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/health_management_dev',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority',
    wtimeout: 2500,
    j: true,
  },
};

// 连接数据库
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbConfig.url, dbConfig.options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // 监听连接事件
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to db');
    });

    mongoose.connection.on('error', err => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('Mongoose disconnected');
    });

    // 优雅关闭连接
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed through app termination');
      process.exit(0);
    });

    // 配置全局插件
    mongoose.plugin(require('../plugins/audit-log'));
    mongoose.plugin(require('../plugins/validation'));
    mongoose.plugin(require('../plugins/timestamps'));

    // 配置全局中间件
    mongoose.set('debug', process.env.NODE_ENV !== 'production');
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

// 数据库配置验证
export const validateDBConfig = () => {
  const requiredEnvVars = ['MONGODB_URI', 'MONGODB_USER', 'MONGODB_PASSWORD'];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return true;
};

// 数据库健康检查
export const checkDBHealth = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();

    return {
      status: 'healthy',
      ping: result.ok === 1,
      readyState: mongoose.connection.readyState,
      responseTime: result.ok === 1 ? 'OK' : 'Failed',
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      readyState: mongoose.connection.readyState,
    };
  }
};

// 数据库统计信息
export const getDBStats = async () => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();

    return {
      collections: stats.collections,
      objects: stats.objects,
      avgObjSize: stats.avgObjSize,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
    };
  } catch (error) {
    logger.error('Failed to get database stats:', error);
    throw error;
  }
};

export default dbConfig;
