import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiUser } from '@/lib/session';

export async function GET() {
  const user = await getApiUser();
  if (!user?.id || user.role !== 'ADMIN') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

  const claims = await prisma.billingClaim.findMany({ where: { status: 'PENDING' }, include: { user: true }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json(claims);
}
