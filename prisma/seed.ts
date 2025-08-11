import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  await prisma.user.createMany({
    data: [
      { email: 'alice@example.com', password, name: 'Alice' },
      { email: 'bob@example.com', password, name: 'Bob' },
      { email: 'carol@example.com', password, name: 'Carol' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
