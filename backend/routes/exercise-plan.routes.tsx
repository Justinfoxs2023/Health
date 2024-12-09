import { Router } from 'express';
import { exercisePlanController } from '../controllers/exercise-plan.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 创建运动计划
router.post('/', auth.required, exercisePlanController.createPlan);

// 获取用户的运动计划列表
router.get('/', auth.required, exercisePlanController.getUserPlans);

// 获取计划详情
router.get('/:id', auth.required, exercisePlanController.getPlanDetails);

// 更新计划状态
router.put('/:id/status', auth.required, exercisePlanController.updatePlanStatus);

// 更新计划进度
router.put('/:id/progress', auth.required, exercisePlanController.updateProgress);

export default router; 