import { Express, Router } from 'express';
import { Logger } from '@utils/logger';
import { healthAssessmentRoutes } from './health-assessment.routes';
import { recommendationRoutes } from './recommendation.routes';
import { analyticsRoutes } from './analytics.routes';

const logger = new Logger('Routes');

export function setupRoutes(app: Express): void {
  try {
    const router = Router();
    const apiPrefix = process.env.API_PREFIX || '/api/v1';

    // 健康检查路由
    router.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
      });
    });

    // API版本路由
    router.get('/version', (req, res) => {
      res.json({
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV
      });
    });

    // 业务路由
    router.use('/health-assessment', healthAssessmentRoutes);
    router.use('/recommendation', recommendationRoutes);
    router.use('/analytics', analyticsRoutes);

    // 注册所有路由
    app.use(apiPrefix, router);

    logger.info(`路由设置完成，API前缀: ${apiPrefix}`);
  } catch (error) {
    logger.error('路由设置失败', error);
    throw error;
  }
}

// 健康评估路由
export const healthAssessmentRoutes = Router();
healthAssessmentRoutes.post('/assess', async (req, res, next) => {
  try {
    // 实现健康评估逻辑
  } catch (error) {
    next(error);
  }
});

// 推荐路由
export const recommendationRoutes = Router();
recommendationRoutes.post('/generate', async (req, res, next) => {
  try {
    // 实现推荐生成逻辑
  } catch (error) {
    next(error);
  }
});

// 分析路由
export const analyticsRoutes = Router();
analyticsRoutes.post('/analyze', async (req, res, next) => {
  try {
    // 实现数据分析逻辑
  } catch (error) {
    next(error);
  }
}); 