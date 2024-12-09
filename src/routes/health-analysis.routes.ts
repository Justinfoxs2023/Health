import { Router } from 'express';
import { HealthAnalysisController } from '../controllers/health-analysis.controller';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();
const healthAnalysisController = new HealthAnalysisController();

// 健康风险评估
router.post(
  '/risks',
  auth.verifyToken,
  rateLimit.standard,
  healthAnalysisController.assessHealthRisks.bind(healthAnalysisController)
);

// 获取健康建议
router.post(
  '/recommendations',
  auth.verifyToken,
  rateLimit.standard,
  healthAnalysisController.getRecommendations.bind(healthAnalysisController)
);

export default router; 