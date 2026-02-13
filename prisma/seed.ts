import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD para criar admin.');

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash: hash, role: 'ADMIN' },
    create: {
      email: email.toLowerCase(),
      passwordHash: hash,
      role: 'ADMIN',
      subscription: { create: { plan: 'PRO', status: 'ACTIVE', provider: 'MANUAL' } }
    }
  });
  console.log('Admin criado/atualizado com sucesso.');
}

main().finally(() => prisma.$disconnect());
