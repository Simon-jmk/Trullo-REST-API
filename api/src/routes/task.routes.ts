import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, validateTask } from '../controllers/task.controller';

const router = Router();

router.post('/', validateTask, createTask);

router.get('/', getTasks);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);



export default router;
