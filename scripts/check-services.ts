import { execSync } from 'child_process';
import { Logger } from '../src/utils/logger';
import mongoose from 'mongoose';
import { createClient } from 'redis';

const logger = new Logger('ServiceCheck');

async function checkMongoDBConnection() {
  try {
    // 检查 MongoDB 服务是否运行
    execSync('mongosh --eval "db.version()"', { stdio: 'ignore' });
    logger.info('MongoDB 服务正在运行');

    // 测试数据库连接
    const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
    const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    
    await mongoose.connect(uri);
    logger.info('MongoDB 连接成功');
    await mongoose.disconnect();
  } catch (error) {
    logger.error('MongoDB 连接失败:', error);
    throw error;
  }
}

async function checkRedisConnection() {
  try {
    // 检查 Redis 服务是否运行
    execSync('redis-cli ping', { stdio: 'ignore' });
    logger.info('Redis 服务正在运行');

    // 测试 Redis 连接
    const client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD
    });

    await client.connect();
    logger.info('Redis 连接成功');
    await client.quit();
  } catch (error) {
    logger.error('Redis 连接失败:', error);
    throw error;
  }
}

async function main() {
  try {
    logger.info('开始检查服务...');
    
    await checkMongoDBConnection();
    await checkRedisConnection();
    
    logger.info('所有服务检查通过');
    process.exit(0);
  } catch (error) {
    logger.error('服务检查失败', error);
    process.exit(1);
  }
}

main(); 