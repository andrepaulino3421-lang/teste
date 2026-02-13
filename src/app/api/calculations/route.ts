import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePricing } from '@/lib/pricing/engine';
import { getUserSubscription, getApiUser } from '@/lib/session';
import { pricingInputSchema } from '@/lib/validators/app';

function monthRange() {
  const now = new Date();
  return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 1) };
}

export async function POST(req: Request) {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const parsed = pricingInputSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const sub = await getUserSubscription(user.id);
  if (sub.plan === 'FREE') {
    const { start, end } = monthRange();
    const count = await prisma.calculation.count({ where: { userId: user.id, createdAt: { gte: start, lt: end } } });
    if (count >= 10) return NextResponse.json({ error: 'Limite do plano FREE atingido, assine PRO.' }, { status: 403 });
  }

  const input = parsed.data;
  const output = calculatePricing({
    cogs: input.cogs,
    packaging: input.packaging,
    overhead: { type: input.overheadType, value: input.overheadValue },
    taxesPercent: input.taxesPercent,
    marketingCPA: input.marketingCPA,
    shipping: { subsidized: input.shippingSubsidized, subsidizedCost: input.shippingCost },
    paymentFee: { percent: input.paymentFeePercent, fixed: input.paymentFeeFixed },
    platformFeePercent: input.platformFeePercent,
    desiredMarginMode: input.desiredMarginMode,
    desiredValue: input.desiredValue
  });

  const created = await prisma.calculation.create({ data: { userId: user.id, channel: input.channel, inputJson: input, outputJson: output } });
  return NextResponse.json({ output, calculationId: created.id });
}
