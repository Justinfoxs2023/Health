import { Router } from 'express';
import { container } from '../di/container';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = container.get<HealthController>(HealthController);

router.get('/health', (req, res) => healthController.check(req, res));

export default router; 