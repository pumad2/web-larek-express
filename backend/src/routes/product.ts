import { Router } from 'express';
import validateCreateProductBody from '../middlewares/schemas/product';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product';
import validateProductId from '../middlewares/schemas/product-id';
import validateUpdateProductBody from '../middlewares/schemas/product-update';

const router = Router();

router.get('/', getProducts);
router.post('/', validateCreateProductBody, createProduct);
router.patch('/:productId', validateProductId, validateUpdateProductBody, updateProduct);
router.delete('/:productId', validateProductId, deleteProduct);

export default router;
