import express, { Router } from 'express';
import { getCategoriesForUser } from '../controllers/categories.js';

const router: Router = express.Router();

router.get('/', getCategoriesForUser);

export default router;
