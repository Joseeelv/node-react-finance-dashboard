import express, { Router } from 'express';
import { getTransactions, getAllTransactions, createTransaction, deleteAllTransactions, deleteTransaction, updateTransaction } from '../controllers/transactions.js';
import { validateBody, validateQuery } from '../middleware/validateDto.js';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
  GetTransactionsSchema,
  DeleteTransactionSchema,
} from '../dtos/transaction.dto.js';

const router: Router = express.Router();

// Transactions Routes
// validateBody(Schema) valida req.body ANTES de que llegue al controller
router.get('/', validateQuery(GetTransactionsSchema), getTransactions);
router.post('/', validateBody(CreateTransactionSchema), createTransaction);
router.delete('/', validateBody(DeleteTransactionSchema), deleteTransaction);
router.delete('/all', deleteAllTransactions);
router.get('/all', getAllTransactions);
router.patch('/:uuid', validateBody(UpdateTransactionSchema), updateTransaction);

export default router;