import mongoose from 'mongoose';
import { Logger } from './logger';
import { createClient } from 'redis';

const logger = new Logger('HealthCheck');

export async function checkServices(): Promise<boolean> {
  try {
    // 检查 MongoDB 连接
    const mongoStatus = mongoose.connection.readyState;
    logger.info(`MongoDB 连接状态: ${mongoStatus === 1 ? '已连接' : '未连接'}`);

    // 检查 Redis 连接
    const redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    await redisClient.connect();
    const redisStatus = await redisClient.ping();
    logger.info(`Redis 连接状态: ${redisStatus === 'PONG' ? '已连接' : '未连接'}`);
    await redisClient.disconnect();

    return true;
  } catch (error) {
    logger.error('服务检查失败', error);
    return false;
  }
}
