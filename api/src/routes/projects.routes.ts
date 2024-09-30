import { Router } from 'express';
import { createProject, getProjects, updateProject, deleteProject, validateProject } from '../controllers/projects.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getProjects); 

router.post('/', validateProject, createProject);

router.put('/:id', authMiddleware, updateProject); 

router.delete('/:id', authMiddleware, deleteProject); 

export default router;
