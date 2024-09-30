import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} from '../controllers/projects.controller';

const router = Router();

router.get('/', authMiddleware('USER'), getProjects);

router.post('/', authMiddleware('USER'), createProject);

router.put('/:id', authMiddleware('USER'), updateProject);

router.delete('/:id', authMiddleware('USER'), deleteProject);

export default router;