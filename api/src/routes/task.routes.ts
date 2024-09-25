import { Router } from 'express';
import { createTask, updateTask, deleteTask, getTasks } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getTasks);

router.post('/', authMiddleware, createTask);

router.put('/:id', authMiddleware, updateTask);

router.delete('/:id', authMiddleware, deleteTask);

export default router;
