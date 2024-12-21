import { AnalysisController } from '../controllers/analysis.controller';
import { Router } from 'express';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { analysisValidators } from '../validators/analysis.validator';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = new Router();
const analysisController = new AnalysisController();

router.get(
  '/health-trends',
  auth.verifyToken,
  rateLimit.standard,
  ValidationMiddleware.validateQuery(analysisValidators.healthTrends),
  analysisController.analyzeHealthTrends.bind(analysisController),
);

router.post(
  '/health-metrics',
  auth.verifyToken,
  rateLimit.standard,
  ValidationMiddleware.validateBody(analysisValidators.healthMetrics),
  analysisController.getHealthMetrics.bind(analysisController),
);

export default router;
