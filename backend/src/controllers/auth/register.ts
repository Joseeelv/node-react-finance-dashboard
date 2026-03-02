import type { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import prisma from '../../lib/prisma.js';

// Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log('Registrando usuario:', { name, email });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}