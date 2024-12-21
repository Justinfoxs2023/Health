import { AdminController } from '../../controllers/admin/admin.controller';
import { Router } from 'express';
import { adminAuth } from '../../middleware/admin-auth.middleware';
import { auth } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// 用户管理路由
router.post(
  '/users',
  [auth.verifyToken, adminAuth.verifyAdmin],
  adminController.handleUserManagement.bind(adminController),
);

// 角色管理路由
router.post(
  '/roles',
  [auth.verifyToken, adminAuth.verifyAdmin],
  adminController.handleRoleManagement.bind(adminController),
);

// 系统配置路由
router.post(
  '/settings',
  [auth.verifyToken, adminAuth.verifyAdmin],
  adminController.handleSystemSettings.bind(adminController),
);

export default router;
