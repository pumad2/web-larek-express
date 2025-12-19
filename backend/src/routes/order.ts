import { Router } from 'express';
import validateCreateOrderBody from '../middlewares/schemas/order';
import createOrder from '../controllers/order';

const router = Router();

router.post('/', validateCreateOrderBody, createOrder);

export default router;
