import prisma from '../models/prismaClient';

export const createProjectService = async (ownerId: number, name: string, description: string) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId,
    },
  });
  return project;
};

export const getProjectsService = async () => {
  const projects = await prisma.project.findMany({
    include: {
      owner: true,
      tasks: true,
    },
  });
  return projects;
}
export const updateProjectService = async (projectId: number, name: string, description: string, ownerId: number) => {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      description,
      ownerId,
    },
  });
  return updatedProject;
}
export const deleteProjectService = async (projectId: number) => {
    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
    });
    return deletedProject;
  };