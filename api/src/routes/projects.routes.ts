import { Router } from 'express';
import { createProject, updateProject, deleteProject, getProjects } from '../controllers/projects.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getProjects);

router.post('/', authMiddleware, createProject);

router.put('/:id', authMiddleware, updateProject);

router.delete('/:id', authMiddleware, deleteProject);

export default router;
