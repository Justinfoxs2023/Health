import { Router } from 'express';
import { dietPlanController } from '../controllers/diet-plan.controller';
import { auth } from '../middleware/auth.tsx';
import { IAuthRequest } from '../types/models';

const router = Router();

// 生成饮食计划
router.post('/',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  dietPlanController.generateDietPlan
);

// 获取用户的饮食计划列表
router.get('/user-plans',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  dietPlanController.getUserPlans
);

// 更新饮食计划状态
router.patch('/:id/status',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  dietPlanController.updatePlanStatus
);

export default router; 