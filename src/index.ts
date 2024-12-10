import 'reflect-metadata';
import express from 'express';
import { config } from 'dotenv';
import { Logger } from '@utils/logger';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { setupMonitoring } from './monitoring';
import { connectDatabases } from './database';

// 加载环境变量
config();

const logger = new Logger('App');

async function bootstrap() {
  try {
    // 创建Express应用
    const app = express();

    // 连接数据库
    await connectDatabases();

    // 设置中间件
    setupMiddlewares(app);

    // 设置路由
    setupRoutes(app);

    // 设置监控
    setupMonitoring(app);

    // 启动服务器
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`服务器已启动，监听端口 ${port}`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      logger.info('收到 SIGTERM 信号，正在关闭服务器...');
      process.exit(0);
    });

  } catch (error) {
    logger.error('启动服务器失败', error);
    process.exit(1);
  }
}

bootstrap(); 