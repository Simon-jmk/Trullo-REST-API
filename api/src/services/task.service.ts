import { TaskStatus } from '@prisma/client';
import prisma from '../models/prismaClient';

export const createTask = async (data: {
  title: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  userIds: number[];
  tags: string;
}) => {
  const { title, description, status, projectId, userIds, tags } = data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const userConnections = (userIds || []).map((userId) => ({ id: userId }));

  if (userConnections.length > 0) {
    const users = await prisma.user.findMany({
      where: { id: { in: userConnections.map((u) => u.id) } },
    });

    if (users.length !== userConnections.length) {
      throw new Error('One or more users not found');
    }
  }

  return prisma.task.create({
    data: {
      title,
      description,
      status,
      project: { connect: { id: projectId } },
      users: { connect: userConnections },
      tags,
    },
  });
};

export const getTasks = async () => {
  return prisma.task.findMany({
    include: {
      project: true,
      users: true,
    },
  });
};

export const updateTask = async (id: number, data: {
  title?: string;
  description?: string;
  status?: TaskStatus;
  userIds?: number[];
  tags?: string;
}) => {
  const { title, description, status, userIds, tags } = data;

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    throw new Error('Task not found');
  }

  const userConnections = (userIds || []).map((userId) => ({ id: userId }));

  return prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
      tags: tags || '',
      users: { set: userConnections },
    },
  });
};

export const deleteTaskService = async (id: number) => {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }
  
    await prisma.task.delete({ where: { id } });
  
    return task;
  };