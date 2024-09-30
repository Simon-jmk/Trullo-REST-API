import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import prisma from '../models/prismaClient';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

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
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: true,
        tasks: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export async function updateProject(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const projectId = parseInt(req.params.id);
  const { name, description, ownerId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this project' });
    }

    if (ownerId) {
      const newOwner = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!newOwner) {
        return res.status(400).json({ error: 'Invalid new owner ID' });
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        ownerId,
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response) {
  const projectId = parseInt(req.params.id);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this project' });
    }

    await prisma.task.deleteMany({
      where: { projectId: projectId },
    });

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}

export const validateProject = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
];
