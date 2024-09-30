import { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../models/prismaClient';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, status, projectId, userIds, tags } = req.body;

  const project = await prisma.project.findUnique({
      where: { id: projectId },
  });

  if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
  }

  const userConnections = (userIds || []).map((userId: number) => ({ id: userId }));

  if (userConnections.length > 0) {
      const users = await prisma.user.findMany({
          where: { id: { in: userConnections.map((u: { id: number }) => u.id) } },
      });

      if (users.length !== userConnections.length) {
          return res.status(404).json({ message: 'One or more users not found.' });
      }
  }

  try {
      const task = await prisma.task.create({
          data: {
              title,
              description,
              status,
              project: { connect: { id: projectId } },
              users: { connect: userConnections },
              tags,
          },
      });

      res.status(201).json(task);
  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Error creating task', error });
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

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const { title, description, status, userIds, tags } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const userConnections = (userIds || []).map((userId: number) => ({ id: userId }));

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        tags: tags || '',
        users: {
          set: userConnections,
        },
      },
    });

    res.status(200).json({ updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
];
