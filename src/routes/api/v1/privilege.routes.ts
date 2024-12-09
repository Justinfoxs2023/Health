import { Router } from 'express';
import { PrivilegeController } from '../../../controllers/privilege.controller';
import { authMiddleware, adminMiddleware } from '../../../middlewares/auth.middleware';
import { validatePrivilege } from '../../../middlewares/validation.middleware';

const router = Router();
const controller = new PrivilegeController();

// 获取会员权益
router.get(
  '/tier/:tierId',
  authMiddleware,
  controller.getTierPrivileges
);

// 添加新权益 (管理员)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validatePrivilege,
  controller.addPrivilege
);

// 修改权益 (管理员)
router.put(
  '/:privilegeId',
  authMiddleware,
  adminMiddleware,
  validatePrivilege,
  controller.updatePrivilege
);

// 删除权益 (管理员)
router.delete(
  '/:privilegeId',
  authMiddleware,
  adminMiddleware,
  controller.removePrivilege
);

// 查看权益使用情况 (管理员)
router.get(
  '/:privilegeId/usage',
  authMiddleware,
  adminMiddleware,
  controller.checkPrivilegeUsage
);

export default router; 