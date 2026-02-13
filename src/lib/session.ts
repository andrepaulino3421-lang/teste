import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { authOptions } from './auth';

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');
  return session.user;
}

export async function getApiUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function getUserSubscription(userId: string) {
  return prisma.subscription.upsert({
    where: { userId },
    update: {},
    create: { userId, plan: 'FREE', status: 'ACTIVE', provider: 'MANUAL' }
  });
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/app/dashboard');
  return user;
}
