import express from 'express';
import { register } from '../controllers/auth/register';
import { login } from '../controllers/auth/login';

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);

export default router;