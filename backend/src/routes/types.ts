import express, { Router } from 'express';
import { getAllTypes } from '../controllers/types.js';

const router: Router = express.Router();

router.get('/', getAllTypes);

export default router;