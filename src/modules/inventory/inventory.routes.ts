import { Router } from 'express';
import InventoryController from './inventory.controllers';
import { validateData } from '../../middleware/validate.middleware';
import { InventoryCreate, InventoryPatch } from './inventory.schemas';
import { withTransaction } from '../../middleware/transaction.middleware';

const router = Router({ mergeParams: true });

router.get('/', InventoryController.getByProductId);
router.get('/history', InventoryController.getHistory);
router.post(
  '/',
  validateData(InventoryCreate),
  withTransaction,
  InventoryController.createInventory,
);
router.patch(
  '/',
  validateData(InventoryPatch),
  withTransaction,
  InventoryController.changeStock,
);
export default router;
