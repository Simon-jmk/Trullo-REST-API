import { Router } from 'express';
import { getUser, deleteUser, getAllUsers, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { updateUserValidation } from '../services/user.services';

const router = Router();

router.get('/', getAllUsers);

router.get('/user', authMiddleware, getUser);

router.put('/user', authMiddleware, updateUserValidation, updateUser);

router.delete('/delete/me', authMiddleware, deleteUser);

export default router;
