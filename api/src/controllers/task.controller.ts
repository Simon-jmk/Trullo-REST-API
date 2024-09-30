import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import prisma from '../models/prismaClient';

export const createTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, status, userIds, projectId, tags } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const userConnections = (userIds || []).map((userId: number) => ({ id: userId }));

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        project: { connect: { id: projectId } },
        tags: tags || '',
        users: {
          connect: userConnections,
        },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        users: true,
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const validateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required'),
];
