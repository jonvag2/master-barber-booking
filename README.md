# Master Barber Booking

Guía rápida para levantar el proyecto (frontend + backend Prisma + PostgreSQL).

## Descripción

Proyecto de ejemplo (Vite + React + TypeScript) con un backend mínimo usando Express y Prisma para persistencia en PostgreSQL.

## Requisitos

- Node.js (v18+ recomendado)
- npm
- Una base de datos PostgreSQL accesible (local o remota)

## Instalación

1. Clona el repositorio y entra en la carpeta:

```bash
git clone <repo-url>
cd master-barber-booking
```

2. Instala dependencias (raíz del proyecto):

```bash
npm install
```

3. Instala dependencias del servidor (opcional si quieres ejecutar el backend desde `server/`):

```bash
cd server
npm install
cd ..
```

## Configuración (.env)

Debes crear un archivo `.env` dentro de `server/` con la cadena de conexión a PostgreSQL. Ejemplo (`server/.env`):

```
DATABASE_URL="postgresql://user:password@localhost:5432/master_barber_db?schema=public"
# Opcional: cambiar el puerto del backend (por defecto 4000)
PORT=4000
```

Si quieres apuntar el frontend a un backend distinto, crea también un `.env` en la raíz con:

```
VITE_API_URL=http://localhost:4000
```

Después de editar `.env`, asegúrate de reiniciar los procesos (backend/frontend) para que carguen las variables.

## Migraciones y Prisma

Desde `server/` ejecuta:

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

Esto aplica las migraciones y genera el cliente de Prisma.

## Seed (desarrollo)

Para poblar la base de datos en desarrollo puedes ejecutar la semilla (hay dos implementaciones; la programática con Prisma es idempotente y recomendada):

```bash
cd server
# Ejecuta el seeder programático TypeScript (usa Prisma Client)
npx ts-node prisma/seedPrisma.ts

# (alternativa) si has configurado `prisma.seed` en package.json:
npx prisma db seed
```

Después puedes verificar que hay datos con el script de comprobación:

```bash
npx ts-node scripts/checkSeed.ts
```

## Ejecutar en desarrollo

1. Iniciar backend (desde `server/`):

```bash
cd server
npm run dev
```

El backend por defecto escucha en `http://localhost:4000`.

2. Iniciar frontend (desde la raíz):

```bash
npm run dev
```

Vite normalmente sirve en `http://localhost:8080` (si ese puerto está en uso intentará otro puerto, p.ej. 8081).

La aplicación frontend leerá `VITE_API_URL` (si existe) o usará `http://localhost:4000` por defecto para llamar a las APIs:

- GET /api/barbershops
- GET /api/barbers
- GET /api/services
- POST /api/bookings

## Build para producción

Para compilar el frontend:

```bash
npm run build
```

Para compilar el backend:

```bash
cd server
npm run build
```

Y luego ejecutarlo con `node` (asegúrate de tener las variables de entorno en producción):

```bash
cd server
NODE_ENV=production node ./dist/index.js
```

## Scripts útiles

- `npm run dev` — Inicia Vite (frontend)
- `cd server && npm run dev` — Inicia backend en modo desarrollo con `ts-node-dev`
- `cd server && npx prisma migrate dev --name init` — Aplica migraciones
- `cd server && npx ts-node prisma/seedPrisma.ts` — Seeder programático idempotente
- `cd server && npx ts-node scripts/checkSeed.ts` — Comprueba conteos en la DB

## Problemas comunes

- Error `@import must precede all other statements` al arrancar Vite: mueve cualquier `@import` (ej. Google Fonts) al principio de `src/index.css` antes de las directivas `@tailwind`.
- Si el frontend no muestra datos:
  - Comprueba que el backend está corriendo (`Server listening on http://localhost:4000`).
  - Revisa `VITE_API_URL` en la raíz si tu backend no está en `localhost:4000`.
  - Abre DevTools > Network para ver las peticiones API y errores.
- Si ves warnings de `Browserslist` ejecuta:

```bash
npx update-browserslist-db@latest
```

## Notas finales

Este README cubre los pasos básicos para desarrollo. Si quieres, puedo:

- Añadir un `Makefile` o `package.json` script que ejecute: instalar deps, migrar, seed y levantar ambos servidores.
- Añadir docker-compose para levantar PostgreSQL y la app localmente.

Dime si quieres que añada cualquiera de los anteriores.
# Barber daily

## Project info

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone  

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

