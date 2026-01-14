import prisma from '../src/prisma';

async function main() {
  const barbershopsCount = await prisma.barbershop.count();
  const barbersCount = await prisma.barber.count();
  const servicesCount = await prisma.service.count();
  const bookingsCount = await prisma.booking.count();

  console.log('Counts:');
  console.log('Barbershops:', barbershopsCount);
  console.log('Barbers:', barbersCount);
  console.log('Services:', servicesCount);
  console.log('Bookings:', bookingsCount);

  const shops = await prisma.barbershop.findMany({ take: 3 });
  const barbers = await prisma.barber.findMany({ take: 3 });
  const services = await prisma.service.findMany({ take: 5 });
  const bookings = await prisma.booking.findMany({ take: 5 });

  console.log('\nSample Barbershops:', shops);
  console.log('\nSample Barbers:', barbers);
  console.log('\nSample Services:', services);
  console.log('\nSample Bookings:', bookings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
