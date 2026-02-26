import { Router } from 'express';
import InventoryController from './inventory.controllers';
import { validateData } from '../../middleware/validate.middleware';
import { InventoryCreate } from './inventory.schemas';
import { withTransaction } from '../../middleware/transaction.middleware';

const router = Router({ mergeParams: true });

router.get('/', InventoryController.getByIdProduct);
router.post(
  '/',
  validateData(InventoryCreate),
  withTransaction,
  InventoryController.createInventory,
);
router.patch(
  '/',
  validateData(InventoryCreate),
  withTransaction,
  InventoryController.changeStock,
);
export default router;
