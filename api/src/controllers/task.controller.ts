import { Request, Response } from 'express';
import prisma from '../models/prismaClient';

export async function getTasks(req: Request, res: Response) {
  const userId = req.userId;

  try {
    const tasks = await prisma.task.findMany({
      where: { assignedTo: userId },
      include: { project: true },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.create({
      data: req.body,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export async function updateTask(req: Request, res: Response) {
  const taskId = parseInt(req.params.id);
  const { title, description, status, tags } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        tags,
      },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const taskId = parseInt(req.params.id);

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
