import { Router } from 'express';
import validateCreateProductBody from '../middlewares/schemas/product';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product';
import tokenMiddleware from '../middlewares/token';
import validateUpdateProductBody from '../middlewares/schemas/product-update';

const router = Router();

router.get('/', getProducts);
router.post('/', tokenMiddleware, validateCreateProductBody, createProduct);
router.patch('/:productId', tokenMiddleware, validateUpdateProductBody, updateProduct);
router.delete('/:productId', tokenMiddleware, deleteProduct);

export default router;
