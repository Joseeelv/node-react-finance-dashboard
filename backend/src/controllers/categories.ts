import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getCategoriesForUser = async (req: Request, res: Response) => {
  try {

    let categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        uuid: true,
        name: true,
        color: true,
        icon: true,
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
