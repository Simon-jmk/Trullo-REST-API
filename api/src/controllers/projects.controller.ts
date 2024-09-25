import { Request, Response } from 'express';
import prisma from '../models/prismaClient';

export async function getProjects(req: Request, res: Response) {
  const userId = req.userId;

  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export async function updateProject(req: Request, res: Response) {
  const projectId = parseInt(req.params.id);
  const { name, description } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
}

export async function deleteProject(req: Request, res: Response) {
  const projectId = parseInt(req.params.id);

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
}
