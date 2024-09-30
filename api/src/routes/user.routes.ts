import { Router } from 'express';
import { getUser, deleteUser, getAllUsers, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware('ADMIN'), getAllUsers);

router.get('/user', authMiddleware('USER'), getUser);

router.put('/user', authMiddleware('USER'), updateUser);

router.delete('/delete/me', authMiddleware('USER'), deleteUser);

export default router;