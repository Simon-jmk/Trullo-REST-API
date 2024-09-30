import { Request, Response } from 'express';
import { signupService, loginService } from '../services/auth.service';
import { validationResult } from 'express-validator';

export async function signup(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const user = await signupService(name, email, password);
    const token = await loginService(email, password);
    return res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    if (error instanceof Error && error.message.includes('User already exists')) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to sign up user' });
  }
}


export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const token = await loginService(email, password);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).json({ error: 'Invalid credentials' });
  }
}