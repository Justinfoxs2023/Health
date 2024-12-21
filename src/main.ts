import 'dotenv/config';
import express from 'express';
import { Logger } from './utils/logger';
import { connectDatabase } from './config/database.config';
import { connectRedis } from './config/redis.config';

const logger = new Logger('Main');

async function bootstrap(): Promise<void> {
  try {
    logger.info('Starting development server...');

    // 连接数据库
    await connectDatabase();

    // 连接Redis
    const redisClient = await connectRedis();

    // 创建Express应用
    const app = express();
    const port = process.env.APP_PORT || 3000;

    // 基础中间件
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 启动服务器
    app.listen(port, () => {
      logger.info(`Development server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start development server', error);
    process.exit(1);
  }
}

bootstrap();
