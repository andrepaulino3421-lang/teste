import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getApiUser } from '@/lib/session';

const schema = z.object({ adminNote: z.string().max(500).optional() });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getApiUser();
  if (!user?.id || user.role !== 'ADMIN') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Nota inválida' }, { status: 400 });

  const claim = await prisma.billingClaim.findUnique({ where: { id: params.id } });
  if (!claim || claim.status !== 'PENDING') return NextResponse.json({ error: 'Claim não pendente' }, { status: 400 });

  await prisma.$transaction([
    prisma.billingClaim.update({ where: { id: params.id }, data: { status: 'APPROVED', processedAt: new Date(), adminNote: parsed.data.adminNote } }),
    prisma.subscription.upsert({ where: { userId: claim.userId }, update: { plan: 'PRO', status: 'ACTIVE', provider: 'MANUAL' }, create: { userId: claim.userId, plan: 'PRO', status: 'ACTIVE', provider: 'MANUAL' } })
  ]);

  return NextResponse.json({ ok: true });
}
