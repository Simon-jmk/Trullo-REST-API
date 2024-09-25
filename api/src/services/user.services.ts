import prisma from '../models/prismaClient'; 

export async function createUser(name: string, email: string, password: string) {
  return prisma.user.create({
    data: { name, email, password },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    include: { projects: true, tasks: true },
  });
}
