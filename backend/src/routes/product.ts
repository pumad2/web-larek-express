import { Router } from 'express';
import validateCreateProductBody from '../middlewares/schemas/product';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product';
import validateUpdateProductBody from '../middlewares/schemas/product-update';

const router = Router();

router.get('/', getProducts);
router.post('/', validateCreateProductBody, createProduct);
router.patch('/:productId', validateUpdateProductBody, updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
