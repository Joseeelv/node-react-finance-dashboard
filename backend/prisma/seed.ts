import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('Empezando el seeding...');

  // 1. Crear o obtener un usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password_here',
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
        userId: user.id,
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
