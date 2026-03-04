import type {Request, Response} from 'express';
import prisma from '../lib/prisma.js';

export const getAllTypes = async (req: Request, res: Response) => {
  try{
    const types = await prisma.transactionCategory.findMany({
      orderBy: { name: 'asc' },
      select:{
        uuid: true,
        name: true,
        icon: true,
      }
    });
      
    return res.status(200).json(types);
  }catch(error){
    console.error('Error fetching types:', error);
    return res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};