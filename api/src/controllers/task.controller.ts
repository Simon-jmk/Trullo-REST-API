import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { deleteTaskService } from '../services/task.service';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, status, projectId, userIds, tags } = req.body;

  try {
    const task = await taskService.createTask({
      title,
      description,
      status,
      projectId,
      userIds,
      tags,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTasks();
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
    const updatedTask = await taskService.updateTask(id, {
      title,
      description,
      status,
      userIds,
      tags,
    });
    res.status(200).json({ updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const deletedTask = await deleteTaskService(id); 
    res.status(200).json({ message: 'Task deleted successfully', Task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
