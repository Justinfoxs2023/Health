import { Router } from 'express';
import { InteractionController } from '../controllers/interaction.controller';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();
const interactionController = new InteractionController();

// 处理用户查询
router.post(
  '/query',
  auth.verifyToken,
  rateLimit.standard,
  interactionController.handleQuery.bind(interactionController)
);

// 获取UI配置
router.get(
  '/ui-config/:userId',
  auth.verifyToken,
  rateLimit.standard,
  interactionController.getUIConfig.bind(interactionController)
);

export default router; 