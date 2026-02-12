import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { billingClaimSchema } from '@/lib/validators/auth';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  if (!rateLimit(`claim:${session.user.id}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Muitas tentativas' }, { status: 429 });
  }

  const payload = await req.json();
  const parsed = billingClaimSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const claim = await prisma.billingClaim.create({
    data: {
      userId: session.user.id,
      purchaseEmail: parsed.data.purchaseEmail,
      orderCode: parsed.data.orderCode,
      note: parsed.data.note,
      status: 'PENDING'
    }
  });

  return NextResponse.json(claim);
}
