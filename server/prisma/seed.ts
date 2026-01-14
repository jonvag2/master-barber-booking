import fs from 'fs';
import path from 'path';
import prisma from '../src/prisma';

async function main() {
  const sqlPath = path.join(__dirname, 'seed.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split the SQL file into individual statements and run them sequentially.
  // This avoids Prisma errors when trying to execute multiple commands in one prepared statement.
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    // Skip statements that are purely comments
    if (stmt.startsWith('--') || stmt.length === 0) continue;
    await prisma.$executeRawUnsafe(stmt);
  }
  console.log('Seed SQL executed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
