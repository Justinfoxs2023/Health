import { Router } from 'express';
import { auth } from '../middleware/auth';
import { authController } from '../controllers/auth.controller';

const router = Router();

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 验证邮箱
router.get('/verify-email/:token', authController.verifyEmail);

// 请求重置密码
router.post('/forgot-password', authController.forgotPassword);

// 重置密码
router.post('/reset-password/:token', authController.resetPassword);

// 修改密码(需要登录)
router.post('/change-password', auth.required, authController.changePassword);

export default router;
