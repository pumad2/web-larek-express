import { Router } from 'express';
import validateLoginBody from '../middlewares/schemas/login';
import validateRegisterBody from '../middlewares/schemas/register';
import {
  login,
  register,
  refreshAccessToken,
  logout,
  getCurrentUser,
} from '../controllers/auth';
import tokenMiddleware from '../middlewares/token';

const router = Router();

router.post('/login', validateLoginBody, login);
router.post('/register', validateRegisterBody, register);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', tokenMiddleware, getCurrentUser);

export default router;
