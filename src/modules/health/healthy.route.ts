import { Router } from 'express';
import * as HealthController from './healthy.controller';

const router = Router();

router.get('/', HealthController.getHealthStatus);

export default router;
