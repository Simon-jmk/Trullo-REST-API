import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  getAllUsersService,
  getUserService,
  updateUserService,
  deleteUserService
} from '../services/user.services';
import { Role } from '@prisma/client'; 

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users with projects and tasks:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
  }

  try {
    const user = await getUserService(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, role } = req.body;

  if (role && !Object.values(Role).includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided.' });
  }

  try {
    const updatedUser = await updateUserService(userId, name, email, role);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing.' });
  }

  try {
    const deletedUser = await deleteUserService(userId);
    res.status(200).json({ message: 'User deleted successfully', User: deletedUser });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: (error as Error).message });
  }
};