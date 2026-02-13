import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getUserSubscription, requireUser } from '@/lib/session';

export default async function DashboardPage() {
  const user = await requireUser();
  const sub = await getUserSubscription(user.id);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const monthCalcs = await prisma.calculation.findMany({ where: { userId: user.id, createdAt: { gte: start, lt: end } } });
  const avgMargin = monthCalcs.length
    ? monthCalcs.reduce((acc, c) => acc + Number((c.outputJson as any).netMarginPercent ?? 0), 0) / monthCalcs.length
    : 0;
  const recent = await prisma.calculation.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Cálculos no mês</p><p className="text-2xl font-bold">{monthCalcs.length}</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Média de margem</p><p className="text-2xl font-bold">{avgMargin.toFixed(2)}%</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Plano</p><p className="text-2xl font-bold">{sub.plan}</p></article>
      </section>

      {sub.plan === 'FREE' && (
        <section className="rounded border border-amber-300 bg-amber-50 p-4">
          <p>Você está em {monthCalcs.length}/10 cálculos este mês.</p>
          {monthCalcs.length >= 8 && <Link className="text-blue-600 underline" href="/app/billing">Assine PRO para evitar bloqueio</Link>}
        </section>
      )}

      <section className="rounded bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Últimos 5 cálculos</h3>
        <ul className="space-y-1 text-sm">
          {recent.map((r) => <li key={r.id}>{r.channel} — {(r.outputJson as any).recommendedPrice} — {new Date(r.createdAt).toLocaleString('pt-BR')}</li>)}
          {!recent.length && <li>Nenhum cálculo ainda.</li>}
        </ul>
      </section>
    </div>
  );
}
