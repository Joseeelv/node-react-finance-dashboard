import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import prisma from './lib/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Connected to database successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to database', details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
