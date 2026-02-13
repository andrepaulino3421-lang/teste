import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSubscription, getApiUser } from '@/lib/session';

export async function GET() {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const sub = await getUserSubscription(user.id);
  if (sub.plan !== 'PRO') return NextResponse.json({ error: 'Export CSV disponível apenas no PRO.' }, { status: 403 });

  const rows = await prisma.calculation.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  const header = 'id,channel,recommendedPrice,netProfit,netMarginPercent,createdAt\n';
  const body = rows.map((r) => `${r.id},${r.channel},${(r.outputJson as any).recommendedPrice},${(r.outputJson as any).netProfit},${(r.outputJson as any).netMarginPercent},${r.createdAt.toISOString()}`).join('\n');

  return new NextResponse(header + body, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="historico-precificapro.csv"' }
  });
}
