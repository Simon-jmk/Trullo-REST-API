import { Router } from 'express';
import { createTask, getTasks } from '../controllers/task.controller';

const router = Router();

router.get('/', getTasks);

router.post('/', createTask);


export default router;
