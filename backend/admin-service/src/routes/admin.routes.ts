import { AdminController } from '../controllers/admin.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { ContentController } from '../controllers/content.controller';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();
const adminController = new AdminController();
const analyticsController = new AnalyticsController();
const contentController = new ContentController();

// 用户管理路由
router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), adminController.getUsers);

router.put(
  '/users/:userId/roles',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  adminController.updateUserRole,
);

// 数据分析路由
router.get(
  '/analytics/user-growth',
  authMiddleware,
  roleMiddleware(['ADMIN', 'DATA_ANALYST']),
  analyticsController.getUserGrowth,
);

router.get(
  '/analytics/health-stats',
  authMiddleware,
  roleMiddleware(['ADMIN', 'DATA_ANALYST']),
  analyticsController.getHealthStats,
);

router.post(
  '/analytics/reports',
  authMiddleware,
  roleMiddleware(['ADMIN', 'DATA_ANALYST']),
  analyticsController.generateReport,
);

// 内容管理路由
router.get(
  '/contents',
  authMiddleware,
  roleMiddleware(['ADMIN', 'CONTENT_ADMIN']),
  contentController.getContents,
);

router.put(
  '/contents/:contentId/review',
  authMiddleware,
  roleMiddleware(['ADMIN', 'CONTENT_ADMIN']),
  contentController.reviewContent,
);

router.put(
  '/contents/:contentId/publish',
  authMiddleware,
  roleMiddleware(['ADMIN', 'CONTENT_ADMIN']),
  contentController.publishContent,
);

router.get(
  '/contents/stats',
  authMiddleware,
  roleMiddleware(['ADMIN', 'CONTENT_ADMIN']),
  contentController.getContentStats,
);

export default router;
