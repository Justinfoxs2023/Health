import { Router } from 'express';
import { healthRiskController } from '../controllers/health-risk.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 获取用户的风险预警列表
router.get('/', auth.required, healthRiskController.getUserRisks);

// 更新风险状态
router.put('/:id/status', auth.required, healthRiskController.updateRiskStatus);

// 获取风险详情
router.get('/:id', auth.required, healthRiskController.getRiskDetails);

// 获取风险统计
router.get('/stats', auth.required, healthRiskController.getRiskStats);

export default router; 