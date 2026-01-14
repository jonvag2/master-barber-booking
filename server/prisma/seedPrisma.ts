import prisma from '../src/prisma';

async function main() {
  // Barbershops
  const shops = [
    {
      id: 'barber-central',
      name: 'Master Barber Central',
      address: 'Av. Principal 123, Centro',
      rating: 4.9,
      image: '🏢',
      phone: '+1 234 567 8901',
      description: 'Nuestra sucursal insignia en el corazón de la ciudad',
    },
    {
      id: 'barber-norte',
      name: 'Master Barber Norte',
      address: 'Blvd. Norte 456, Zona Norte',
      rating: 4.8,
      image: '🏬',
      phone: '+1 234 567 8902',
      description: 'Experiencia premium en la zona norte',
    },
    {
      id: 'barber-sur',
      name: 'Master Barber Sur',
      address: 'Calle Sur 789, Plaza Sur',
      rating: 4.7,
      image: '🏛️',
      phone: '+1 234 567 8903',
      description: 'Tu barbería de confianza en el sur',
    },
  ];

  for (const s of shops) {
    await prisma.barbershop.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }

  // Services
  const services = [
    { id: 'corte-caballero', name: 'Corte Caballero', price: 25, duration: 30, description: 'Corte clásico o moderno con acabado profesional', isVip: false },
    { id: 'barba-toalla', name: 'Barba & Toalla Caliente', price: 20, duration: 25, description: 'Afeitado tradicional con toalla caliente', isVip: false },
    { id: 'combo-full', name: 'Combo Full', price: 40, duration: 50, description: 'Corte + Barba completo', isVip: false },
    { id: 'corte-nino', name: 'Corte Niño', price: 18, duration: 25, description: 'Corte para los más pequeños', isVip: false },
    { id: 'paquete-vip', name: 'Paquete VIP', price: 75, duration: 90, description: 'Corte + Barba + Tratamiento Facial + Masaje', isVip: true },
  ];

  for (const s of services) {
    await prisma.service.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  // Barbers
  const barbers = [
    { id: 'b1', username: 'carlos', name: 'Carlos Mendoza', specialty: 'Cortes Clásicos & Fade', rating: 4.9, experience: '8 años', barbershopId: 'barber-central', availableSlots: ['09:00','10:00','11:00','14:00','15:00','16:00'], clients: 1250 },
    { id: 'b2', username: 'miguel', name: 'Miguel Ángel', specialty: 'Diseños & Barba', rating: 4.8, experience: '5 años', barbershopId: 'barber-central', availableSlots: ['09:30','10:30','11:30','14:30','15:30','17:00'], clients: 890 },
    { id: 'b3', username: 'roberto', name: 'Roberto Silva', specialty: 'Corte Moderno & Color', rating: 4.9, experience: '10 años', barbershopId: 'barber-norte', availableSlots: ['09:00','10:00','12:00','15:00','16:00','18:00'], clients: 2100 },
    { id: 'b4', username: 'alejandro', name: 'Alejandro Cruz', specialty: 'Especialista VIP', rating: 5.0, experience: '12 años', barbershopId: 'barber-norte', availableSlots: ['10:00','11:00','14:00','16:00','17:00'], clients: 3200 },
    { id: 'b5', username: 'david', name: 'David Ramírez', specialty: 'Cortes Infantiles', rating: 4.7, experience: '4 años', barbershopId: 'barber-sur', availableSlots: ['09:00','10:30','12:00','14:00','15:30','17:00'], clients: 650 },
    { id: 'b6', username: 'fernando', name: 'Fernando López', specialty: 'Afeitado Clásico', rating: 4.8, experience: '7 años', barbershopId: 'barber-sur', availableSlots: ['09:30','11:00','13:00','15:00','16:30','18:30'], clients: 1100 },
  ];

  for (const b of barbers) {
    await prisma.barber.upsert({ where: { id: b.id }, update: {}, create: b });
  }

  // Bookings
  const bookings = [
    { id: 'bk1', serviceId: 'corte-caballero', barberId: 'b1', modality: 'barbershop', date: new Date('2026-01-20T10:00:00Z'), time: '10:00', name: 'Cliente Demo', phone: '+1 111 222 3333', address: '' },
    { id: 'bk2', serviceId: 'paquete-vip', barberId: 'b4', modality: 'home', date: new Date('2026-01-21T16:00:00Z'), time: '16:00', name: 'Cliente VIP', phone: '+1 444 555 6666', address: 'Calle Falsa 123, Piso 2' },
  ];

  for (const bk of bookings) {
    await prisma.booking.upsert({ where: { id: bk.id }, update: {}, create: bk });
  }

  console.log('Prisma seed upserts completed');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
