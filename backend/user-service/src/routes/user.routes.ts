import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';

const router = new Router();
const userController = new UserController();

// 获取用户信息
router.get(
  '/profile',
  auth.verifyToken,
  rateLimit.standard,
  userController.getUserProfile.bind(userController),
);

// 更新用户信息
router.put(
  '/profile',
  auth.verifyToken,
  rateLimit.standard,
  userController.updateUserProfile.bind(userController),
);

// 更新头像
router.put(
  '/avatar',
  auth.verifyToken,
  rateLimit.upload,
  uploadMiddleware.single('avatar'),
  userController.updateAvatar.bind(userController),
);

export default router;
