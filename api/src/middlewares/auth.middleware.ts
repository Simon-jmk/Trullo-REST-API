import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
  userId?: number;
  role?: string;
}

const roleHierarchy = {
  USER: 1,
  ADMIN: 2,
};

export const authMiddleware = (requiredRole: keyof typeof roleHierarchy) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      if (!SECRET_KEY) {
        console.error('JWT secret is not defined');
        return res.status(500).json({ message: 'Internal server error: JWT secret is missing' });
      }

      const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; role: string };
      req.userId = decoded.userId;
      req.role = decoded.role;

      if (roleHierarchy[req.role as keyof typeof roleHierarchy] < roleHierarchy[requiredRole]) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: 'Invalid token. Access denied.' });
      } else {
        console.error('Token verification failed:', error);
        return res.status(500).json({ message: 'Token verification failed. Internal server error.' });
      }
    }
  };
};