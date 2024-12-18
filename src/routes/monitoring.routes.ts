import { MonitoringController } from '../controllers/monitoring.controller';
import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();
const monitoringController = new MonitoringController();

// 获取性能指标
router.get(
  '/metrics',
  auth.verifyToken,
  rateLimit.standard,
  monitoringController.getPerformanceMetrics.bind(monitoringController),
);

// 检测系统异常
router.get(
  '/anomalies',
  auth.verifyToken,
  rateLimit.standard,
  monitoringController.detectAnomalies.bind(monitoringController),
);

// 获取优化建议
router.get(
  '/optimization',
  auth.verifyToken,
  rateLimit.standard,
  monitoringController.getOptimizationPlan.bind(monitoringController),
);

export default router;
