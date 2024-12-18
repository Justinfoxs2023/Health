import { Router } from 'express';
import { aiModelRoutes } from './ai-model.routes';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { monitoringRoutes } from './monitoring.routes';
import { performanceRoutes } from './performance.routes';
import { rateLimitMiddleware } from '../../middlewares/rate-limit.middleware';

const router = Router();

// AI模型管理路由
router.use('/ai-models', authMiddleware, rateLimitMiddleware, aiModelRoutes);

// 性能监控路由
router.use('/performance', authMiddleware, rateLimitMiddleware, performanceRoutes);

// 监控仪表板路由
router.use('/monitoring', authMiddleware, rateLimitMiddleware, monitoringRoutes);

export default router;
