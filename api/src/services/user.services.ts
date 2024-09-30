import prisma from '../models/prismaClient';
import { Role } from '@prisma/client';

export const getAllUsersService = async () => {
  return await prisma.user.findMany({
    include: {
      projects: {
        include: {
          tasks: true,
        },
      },
    },
  });
};

export const getUserService = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

export const updateUserService = async (userId: number, name: string, email: string, role?: Role) => {
  const updateData: any = { name, email };

  if (role) {
    updateData.role = role;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return updatedUser;
};

export const deleteUserService = async (userId: number) => {
  const userToDelete = await prisma.user.findUnique({ where: { id: userId } });
  if (!userToDelete) {
    throw new Error('User not found.');
  }

  await prisma.task.deleteMany({
    where: { users: { some: { id: userId } } },
  });

  await prisma.project.deleteMany({
    where: { ownerId: userId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  return userToDelete;
};