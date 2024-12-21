import { Router } from 'express';
import { SystemSettingsController } from '../controllers/system-settings.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { container } from '../di/container';

const router = Router();
const controller = container.get<SystemSettingsController>(TYPES.SystemSettingsController);

router.get('/settings', [authMiddleware, adminMiddleware], (req, res) =>
  controller.getSettings(req, res),
);

router.put('/settings', [authMiddleware, adminMiddleware], (req, res) =>
  controller.updateSettings(req, res),
);

export const systemSettingsRoutes = router;
