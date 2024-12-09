import { Router } from 'express';
import { MembershipController } from '../../../controllers/membership.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { validateTierUpgrade } from '../../../middlewares/validation.middleware';

const router = Router();
const controller = new MembershipController();

// 获取会员等级信息
router.get(
  '/tier',
  authMiddleware,
  controller.getMemberTier
);

// 获取会员权益
router.get(
  '/benefits',
  authMiddleware,
  controller.getMemberBenefits
);

// 升级会员等级
router.post(
  '/upgrade',
  authMiddleware,
  validateTierUpgrade,
  controller.upgradeTier
);

// 检查权益使用情况
router.get(
  '/benefit-usage',
  authMiddleware,
  controller.checkBenefitUsage
);

// 激活特定权益
router.post(
  '/benefits/:benefitId/activate',
  authMiddleware,
  controller.activateBenefit
);

export default router; 