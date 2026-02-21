import { Router } from 'express';

import healthRoutes from '../modules/health/healthy.route';

const router = Router();

router.use('/check', healthRoutes);

export default router;
