import { Router } from 'express';
import { auth } from '../middleware/auth';
import { healthTrackingController } from '../controllers/health-tracking.controller';

const router = Router();

// 记录健康数据
router.post('/', auth.required, healthTrackingController.trackHealth);

// 获取健康记录列表
router.get('/', auth.required, healthTrackingController.getHealthRecords);

// 获取健康统计数据
router.get('/stats', auth.required, healthTrackingController.getHealthStats);

export default router;
