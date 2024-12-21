import multer from 'multer';
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { profileController } from '../controllers/profile.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// 获取用户资料
router.get('/', auth.required, profileController.getProfile);

// 更新基本资料
router.put('/', auth.required, profileController.updateProfile);

// 更新头像
router.put('/avatar', auth.required, upload.single('avatar'), profileController.updateAvatar);

// 更新健康数据
router.put('/health-data', auth.required, profileController.updateHealthData);

// 更新用户设置
router.put('/settings', auth.required, profileController.updateSettings);

export default router;
