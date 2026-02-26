import { Router } from 'express';

import healthRoutes from '../modules/health/healthy.route';
import productRoutes from '../modules/product/product.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';
import orderRoutes from '../modules/Order/order.routes';

const router = Router();

router.use('/check', healthRoutes);
router.use('/product', productRoutes);
router.use('/product/:id/inventory', inventoryRoutes);
router.use('/order', orderRoutes);

router.use('/*path', (req, res) => {
  res.status(404).send({
    detail: 'route not found',
    ok: false,
  });
});

export default router;
