# Server (Prisma + Express)

This folder contains a minimal Node/Express API connected with Prisma to a Postgres database. It exposes endpoints for barbershops, barbers, services and bookings.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres connection string.

2. Install dependencies:

```bash
cd server
npm install
```

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start dev server:

```bash
npm run dev
```

Endpoints

- `GET /api/barbershops`
- `GET /api/barbers`
- `GET /api/services`
- `POST /api/bookings` (body: serviceId, barberId, modality, date, time, name, phone, address)
