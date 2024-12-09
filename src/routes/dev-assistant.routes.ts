import { Router } from 'express';
import { DevAssistantController } from '../controllers/dev-assistant.controller';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();
const devAssistantController = new DevAssistantController();

// 代码审查
router.post(
  '/review',
  auth.verifyToken,
  rateLimit.standard,
  devAssistantController.reviewCode.bind(devAssistantController)
);

// 生成测试
router.post(
  '/tests',
  auth.verifyToken,
  rateLimit.standard,
  devAssistantController.generateTests.bind(devAssistantController)
);

export default router; 