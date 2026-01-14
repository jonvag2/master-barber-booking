-- Seed data for Master Barber Booking
-- Run with: psql "<your DATABASE_URL>" -f prisma/seed.sql

-- Barbershops
INSERT INTO "Barbershop" ("id","name","address","rating","image","phone","description") VALUES
('barber-central','Master Barber Central','Av. Principal 123, Centro',4.9,'🏢','+1 234 567 8901','Nuestra sucursal insignia en el corazón de la ciudad'),
('barber-norte','Master Barber Norte','Blvd. Norte 456, Zona Norte',4.8,'🏬','+1 234 567 8902','Experiencia premium en la zona norte'),
('barber-sur','Master Barber Sur','Calle Sur 789, Plaza Sur',4.7,'🏛️','+1 234 567 8903','Tu barbería de confianza en el sur')
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO "Service" ("id","name","price","duration","description","isVip") VALUES
('corte-caballero','Corte Caballero',25.0,30,'Corte clásico o moderno con acabado profesional',false),
('barba-toalla','Barba & Toalla Caliente',20.0,25,'Afeitado tradicional con toalla caliente',false),
('combo-full','Combo Full',40.0,50,'Corte + Barba completo',false),
('corte-nino','Corte Niño',18.0,25,'Corte para los más pequeños',false),
('paquete-vip','Paquete VIP',75.0,90,'Corte + Barba + Tratamiento Facial + Masaje',true)
ON CONFLICT DO NOTHING;

-- Barbers (availableSlots stored as text[])
INSERT INTO "Barber" ("id","username","name","specialty","rating","experience","barbershopId","availableSlots","clients") VALUES
('b1','carlos','Carlos Mendoza','Cortes Clásicos & Fade',4.9,'8 años','barber-central',ARRAY['09:00','10:00','11:00','14:00','15:00','16:00'],1250),
('b2','miguel','Miguel Ángel','Diseños & Barba',4.8,'5 años','barber-central',ARRAY['09:30','10:30','11:30','14:30','15:30','17:00'],890),
('b3','roberto','Roberto Silva','Corte Moderno & Color',4.9,'10 años','barber-norte',ARRAY['09:00','10:00','12:00','15:00','16:00','18:00'],2100),
('b4','alejandro','Alejandro Cruz','Especialista VIP',5.0,'12 años','barber-norte',ARRAY['10:00','11:00','14:00','16:00','17:00'],3200),
('b5','david','David Ramírez','Cortes Infantiles',4.7,'4 años','barber-sur',ARRAY['09:00','10:30','12:00','14:00','15:30','17:00'],650),
('b6','fernando','Fernando López','Afeitado Clásico',4.8,'7 años','barber-sur',ARRAY['09:30','11:00','13:00','15:00','16:30','18:30'],1100)
ON CONFLICT DO NOTHING;

-- Optional: sample bookings
INSERT INTO "Booking" ("id","serviceId","barberId","modality","date","time","name","phone","address","createdAt") VALUES
('bk1','corte-caballero','b1','barbershop',TIMESTAMP '2026-01-20 10:00:00','10:00','Cliente Demo','+1 111 222 3333','',NOW()),
('bk2','paquete-vip','b4','home',TIMESTAMP '2026-01-21 16:00:00','16:00','Cliente VIP','+1 444 555 6666','Calle Falsa 123, Piso 2',NOW())
ON CONFLICT DO NOTHING;

-- End of seed
