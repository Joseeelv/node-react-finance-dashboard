import type { Request, Response } from 'express';
import type { CreateTransactionDTO, UpdateTransactionDTO, GetTransactionsDTO, DeleteTransactionDTO } from '../dtos/transaction.dto.js';
import prisma from '../lib/prisma.js';

// Get Transactions Controller
export const getTransactions = async (req: Request<{}, {}, GetTransactionsDTO>, res: Response) => {
  try {
    const { documentId } = req.body;

    console.log('Fetching transactions for documentId:', documentId);

    const transactionsWithDetails = await prisma.transaction.findMany({
      where: { userId: documentId },
      orderBy: { date: 'desc' },
      select: {
        uuid: true,
        amount: true,
        date: true,
        description: true,
        category: {
          select: { name: true },
        },
        type: {
          select: { name: true },
        },
      },
    });

    res.status(200).json(transactionsWithDetails);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      select: {
        uuid: true,
        amount: true,
        date: true,
        description: true,
        category: {
          select: { name: true },
        },
        type: {
          select: { name: true },
        },
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};


export const createTransaction = async (req: Request<{}, {}, CreateTransactionDTO>, res: Response) => {
  try {
    const { amount, date, description, categoryId, typeId, documentId } = req.body;

    console.log('Creating transaction with data:', { amount, date, description, categoryId, typeId, documentId });

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        ...(date ? { date } : {}),
        description,
        typeId,
        userId: documentId,
        ...(categoryId !== undefined ? { categoryId } : {}),
      },
      select: {
        uuid: true,
        amount: true,
        date: true,
        description: true,
        category: {
          select: { name: true },
        },
        type: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteAllTransactions = async (req: Request, res: Response) => {
  try {
    await prisma.transaction.deleteMany();
    res.status(200).json({ message: 'All transactions deleted successfully' });
  } catch (error) {
    console.error('Error deleting transactions:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteTransaction = async (req: Request<{}, {}, DeleteTransactionDTO>, res: Response) => {
  try {
    const { uuid } = req.body;

    console.log('Deleting transaction with uuid:', uuid);

    await prisma.transaction.delete({
      where: { uuid }
    });

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// req.body ya fue validado por validateBody(UpdateTransactionSchema) en la ruta.
// El .refine del schema garantiza que al menos un campo esté presente.
export const updateTransaction = async (req: Request<{ uuid: string }, {}, UpdateTransactionDTO>, res: Response) => {
  try {
    const { uuid } = req.params;
    const dataToUpdate = req.body;

    console.log('Updating transaction with uuid:', uuid, 'and data:', dataToUpdate);

    const updatedTransaction = await prisma.transaction.update({
      where: { uuid },
      data: dataToUpdate,
      select: {
        uuid: true,
        amount: true,
        date: true,
        description: true,
        category: {
          select: { name: true },
        },
        type: {
          select: { name: true },
        },
      },
    });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : ' Unknown error' });
  }
};
