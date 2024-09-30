import prisma from '../models/prismaClient';
import { body } from 'express-validator';

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

export const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
];
