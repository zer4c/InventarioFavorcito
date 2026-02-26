import { Router } from 'express';
import { validateData } from '../../middleware/validate.middleware';
import { ProductCreate, ProductPatch } from './product.schemas';
import ProductController from './product.controllers';
import { withTransaction } from '../../middleware/transaction.middleware';

const router = Router();

router.get('/:id', ProductController.getById);
router.get('/', ProductController.getAll);

router.post(
  '/',
  validateData(ProductCreate),
  withTransaction,
  ProductController.createProduct,
);
router.patch(
  '/:id',
  validateData(ProductPatch),
  withTransaction,
  ProductController.patchProduct,
);
router.delete('/:id', withTransaction, ProductController.deleteProduct);


export default router;
