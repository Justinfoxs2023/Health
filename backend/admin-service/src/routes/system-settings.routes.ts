import { Router } from 'express';
import { container } from '../di/container';
import { SystemSettingsController } from '../controllers/system-settings.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();
const controller = container.get<SystemSettingsController>(TYPES.SystemSettingsController);

router.get(
  '/settings',
  [authMiddleware, adminMiddleware],
  (req, res) => controller.getSettings(req, res)
);

router.put(
  '/settings',
  [authMiddleware, adminMiddleware],
  (req, res) => controller.updateSettings(req, res)
);

export const systemSettingsRoutes = router; 