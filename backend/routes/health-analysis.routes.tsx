import { IAuthRequest } from '../types/models';
import { Router } from 'express';
import { auth } from '../middleware/auth.tsx';
import { healthAnalysisController } from '../controllers/health-analysis.controller';

const router = Router();

// 获取健康分析报告
router.get(
  '/analysis',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  healthAnalysisController.analyzeHealthStatus,
);

// 获取历史健康风险记录
router.get(
  '/risks',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  healthAnalysisController.getRiskHistory,
);

export default router;
