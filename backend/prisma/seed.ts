import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('Empezando el seeding...');

  // 1. Crear o obtener un usuario de prueba
  const passwordHash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8rTjAqgYhQZtJ5Z1b2e7iQqQW4'; // hash de "password123"
  const documentId = '123e4567-e89b-12d3-a456-426614174000'; // UUID fijo para el usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: passwordHash,
      documentId: documentId,
    },
  });

  // 2. Limpiar categorías existentes (solo en desarrollo)
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.transactionCategory.deleteMany();

  console.log('Creando tipos de transacción...');
  await prisma.transactionCategory.createMany({
    data: [
      { name: 'INCOME', icon: 'trending-up' },
      { name: 'EXPENSE', icon: 'trending-down' },
    ]
  });

  // 3. Crear categorías por defecto
  const defaultCategories = [
    { name: 'Comida', icon: 'utensils', color: '#FF6B6B' },
    { name: 'Vivienda', icon: 'home', color: '#4DABF7' },
    { name: 'Transporte', icon: 'car', color: '#FFD43B' },
    { name: 'Ocio', icon: 'clapperboard', color: '#BE4BDB' },
    { name: 'Salud', icon: 'heart-pulse', color: '#51CF66' },
    { name: 'Educación', icon: 'book', color: '#FF922B' },
    { name: 'Ropa', icon: 'tshirt', color: '#748FFC' },
    { name: 'Tecnología', icon: 'laptop', color: '#15AABF' },
    { name: 'Viajes', icon: 'plane', color: '#F783AC' },
    { name: 'Regalos', icon: 'gift', color: '#E64980' },
    { name: 'Sueldo', icon: 'money-bill', color: '#20C997' },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        userId: user.documentId,
      },
    });
  }

  // 4. Crear transacciones de ejemplo
  const categories = await prisma.category.findMany({ where: { userId: user.documentId } });
  const transactionTypes = await prisma.transactionCategory.findMany();

  const sampleTransactions = [
    {
      amount: 5000,
      date: new Date(),
      description: 'Sueldo mensual',
      categoryId: categories.find(c => c.name === 'Sueldo')?.id || 0,
      typeId: transactionTypes.find(t => t.name === 'INCOME')?.id || 0,
    },
    {
      amount: -1500,
      date: new Date(),
      description: 'Alquiler',
      categoryId: categories.find(c => c.name === 'Vivienda')?.id || 0,
      typeId: transactionTypes.find(t => t.name === 'EXPENSE')?.id || 0,
    },
    {
      amount: -300,
      date: new Date(),
      description: 'Supermercado',
      categoryId: categories.find(c => c.name === 'Comida')?.id || 0,
      typeId: transactionTypes.find(t => t.name === 'EXPENSE')?.id || 0,
    },
    {
      amount: -200,
      date: new Date(),
      description: 'Transporte público',
      categoryId: categories.find(c => c.name === 'Transporte')?.id || 0,
      typeId: transactionTypes.find(t => t.name === 'EXPENSE')?.id || 0,
    },
  ];

  for (const tx of sampleTransactions) {
    await prisma.transaction.create({
      data: {
        amount: tx.amount,
        date: tx.date,
        description: tx.description,
        categoryId: tx.categoryId,
        typeId: tx.typeId,
        userId: user.documentId,
      },
    });
  }

  console.log('✅ Seeding completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
