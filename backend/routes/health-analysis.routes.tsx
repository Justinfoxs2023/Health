import { Router } from 'express';
import { healthAnalysisController } from '../controllers/health-analysis.controller';
import { auth } from '../middleware/auth.tsx';
import { IAuthRequest } from '../types/models';

const router = Router();

// 获取健康分析报告
router.get('/analysis', 
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  healthAnalysisController.analyzeHealthStatus
);

// 获取历史健康风险记录
router.get('/risks',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  healthAnalysisController.getRiskHistory
);

export default router; 