import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  createProjectService,
  getProjectsService,
  updateProjectService,
  deleteProjectService
} from '../services/projects.services';

export const createProject = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { ownerId, name, description } = req.body;

  if (!ownerId) {
    return res.status(400).json({ error: 'ownerId is required' });
  }

  try {
    const project = await createProjectService(ownerId, name, description);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getProjectsService();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const projectId = parseInt(req.params.id);
  const { name, description, ownerId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const updatedProject = await updateProjectService(projectId, name, description, ownerId);
    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const projectId = parseInt(req.params.id);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const deletedProject = await deleteProjectService(projectId);
    res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
