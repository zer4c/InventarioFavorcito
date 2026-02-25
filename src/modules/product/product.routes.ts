import { Router } from 'express';
import { validateData } from '../../middleware/validate.middleware';
import { ProductCreate, ProductPatch } from './product.schemas';
import ProductController from './product.controllers';

const router = Router();

router.get('/:id', ProductController.getById);
router.get('/', ProductController.getAll);

router.post('/', validateData(ProductCreate), ProductController.createProduct);
router.patch(
  '/:id',
  validateData(ProductPatch),
  ProductController.patchProduct,
);
router.delete('/:id', ProductController.deleteProduct);

export default router;
