import { Router } from 'express';
import { withTransaction } from '../../middleware/transaction.middleware';
import { validateData } from '../../middleware/validate.middleware';
import { OrderCreate } from './order.schemas';
import OrderController from './order.controllers';

const router = Router();

router.get('/:id', OrderController.getById);
router.post(
  '/',
  validateData(OrderCreate),
  withTransaction,
  OrderController.createOrder,
);

export default router;
