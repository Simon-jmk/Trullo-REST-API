import { Router } from 'express';
import { createProject, getProjects, validateProject } from '../controllers/projects.controller';

const router = Router();

router.get('/', getProjects); 

router.post('/', validateProject, createProject);

export default router;
