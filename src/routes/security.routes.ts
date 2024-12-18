import { Router } from 'express';
import { SecurityController } from '../controllers/security.controller';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();
const securityController = new SecurityController();

// 检测威胁
router.post(
  '/threats',
  auth.verifyToken,
  rateLimit.standard,
  securityController.detectThreats.bind(securityController),
);

// 分析用户行为
router.post(
  '/behavior/:userId',
  auth.verifyToken,
  rateLimit.standard,
  securityController.analyzeBehavior.bind(securityController),
);

// 评估风险
router.post(
  '/risk',
  auth.verifyToken,
  rateLimit.standard,
  securityController.assessRisk.bind(securityController),
);

export default router;
