import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const redisClient = createClient();
redisClient.connect();

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // replace: await pool.end();
  });

async function main() {
  const result = await prisma.user.findMany();
  console.log('Found', result.length, 'users');
}