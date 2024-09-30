import prisma from '../models/prismaClient';
import { Project } from '@prisma/client';

export const createProjectService = async (ownerId: number, name: string, description: string): Promise<Project> => {
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId,
      },
    });
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};

export const getProjectsService = async (page: number = 1, limit: number = 10): Promise<Project[]> => {
  try {
    const projects = await prisma.project.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: true,
        tasks: true,
      },
    });
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

export const updateProjectService = async (projectId: number, name: string, description: string, ownerId: number): Promise<Project> => {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        ownerId,
      },
    });
    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

export const deleteProjectService = async (projectId: number): Promise<Project> => {
  try {
    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
    });
    return deletedProject;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};
