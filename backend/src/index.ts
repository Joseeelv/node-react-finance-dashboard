import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


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
