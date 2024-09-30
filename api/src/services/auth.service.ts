import prisma from '../models/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const SECRET_KEY = process.env.JWT_SECRET || 'secret-jwt';

export const generateToken = (user: { id: number; role: string }) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export const signupService = async (name: string, email: string, password: string, role: Role = Role.USER) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return newUser;
};

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken({ id: user.id, role: user.role });

  return token;
};