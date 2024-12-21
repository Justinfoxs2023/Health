import Redis from 'ioredis';
import mongoose from 'mongoose';
import logger from '../utils/logger';

// MongoDB连接
export async function connectMongoDB(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/health_management';
    await mongoose.connect(uri);
    logger.info('MongoDB连接成功');

    mongoose.connection.on('error', error => {
      logger.error('MongoDB连接错误', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB连接断开');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB连接已关闭');
      process.exit(0);
    });
  } catch (error) {
    logger.error('MongoDB连接失败', error);
    throw error;
  }
}

// Redis连接
export async function connectRedis(): Promise<Redis> {
  try {
    const uri = process.env.REDIS_URI || 'redis://localhost:6379';
    const redis = new Redis(uri);

    redis.on('connect', () => {
      logger.info('Redis连接成功');
    });

    redis.on('error', error => {
      logger.error('Redis连接错误', error);
    });

    redis.on('close', () => {
      logger.warn('Redis连接关闭');
    });

    process.on('SIGINT', async () => {
      await redis.quit();
      logger.info('Redis连接已关闭');
      process.exit(0);
    });

    return redis;
  } catch (error) {
    logger.error('Redis连接失败', error);
    throw error;
  }
}

// 连接所有数据库
export async function connectDatabases(): Promise<void> {
  try {
    await Promise.all([connectMongoDB(), connectRedis()]);
    logger.info('所有数据库连接成功');
  } catch (error) {
    logger.error('数据库连接失败', error);
    throw error;
  }
}
