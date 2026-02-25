import { Router } from 'express';

import healthRoutes from '../modules/health/healthy.route';
import productRoutes from '../modules/product/product.routes';
const router = Router();

router.use('/check', healthRoutes);
router.use('/product', productRoutes);

router.use('/*', (req, res) => {
  res.status(404).send({
    detail: 'route not found',
    ok: false,
  });
});

export default router;
