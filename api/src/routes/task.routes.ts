import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware('USER'), createTask);

router.get('/', authMiddleware('USER'), getTasks);

router.put('/:id', authMiddleware('USER'), updateTask);

router.delete('/:id', authMiddleware('USER'), deleteTask);

export default router;