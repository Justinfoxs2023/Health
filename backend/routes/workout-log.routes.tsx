import { Router } from 'express';
import { workoutLogController } from '../controllers/workout-log.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 记录运动
router.post('/', auth.required, workoutLogController.logWorkout);

// 获取运动记录列表
router.get('/', auth.required, workoutLogController.getWorkoutLogs);

// 获取运动统计
router.get('/stats', auth.required, workoutLogController.getWorkoutStats);

export default router; 