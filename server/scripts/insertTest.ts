import prisma from '../src/prisma';

async function main() {
  const shop = await prisma.barbershop.create({
    data: {
      id: 'shop-test-1',
      name: 'Test Shop',
      address: 'Test Address',
      rating: 4.5,
      image: '🏢',
      phone: '+000',
      description: 'Inserted by test',
    },
  });
  console.log('Inserted', shop);

  const count = await prisma.barbershop.count();
  console.log('Count after insert:', count);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
