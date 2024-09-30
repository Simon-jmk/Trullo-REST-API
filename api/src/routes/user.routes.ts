import { Router } from 'express';
import { getUser, getCurrentUser, deleteUser, getAllUsers } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllUsers);

router.get('/:id', authMiddleware, getUser);

router.get('/me', authMiddleware, getCurrentUser);

router.delete('/me', authMiddleware, deleteUser);

export default router;
