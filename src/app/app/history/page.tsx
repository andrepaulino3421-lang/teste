import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getUserSubscription, requireUser } from '@/lib/session';

export default async function HistoryPage({ searchParams }: { searchParams: { channel?: string; page?: string } }) {
  const user = await requireUser();
  const sub = await getUserSubscription(user.id);
  const page = Number(searchParams.page ?? '1');
  const take = 10;

  const where: any = { userId: user.id };
  if (searchParams.channel) where.channel = searchParams.channel;

  const items = await prisma.calculation.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * take, take });

  return (
    <div className="space-y-4">
      <section className="rounded bg-white p-4 shadow flex items-center gap-3">
        <Link href="/app/history">Todos</Link>
        <Link href="/app/history?channel=STORE">Loja</Link>
        <Link href="/app/history?channel=MARKETPLACE">Marketplace</Link>
        <Link href="/app/history?channel=RESTAURANT">Restaurante</Link>
        {sub.plan === 'PRO' ? (
          <a className="ml-auto rounded bg-blue-600 px-3 py-1 text-white" href="/api/history/export">Exportar CSV</a>
        ) : (
          <p className="ml-auto text-sm text-amber-700">Assine PRO para exportar CSV</p>
        )}
      </section>

      <section className="rounded bg-white p-4 shadow">
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="border rounded p-2">
              <p>{i.channel} — {new Date(i.createdAt).toLocaleString('pt-BR')}</p>
              <pre className="overflow-x-auto text-xs">{JSON.stringify(i.outputJson, null, 2)}</pre>
            </li>
          ))}
          {!items.length && <li>Nenhum cálculo.</li>}
        </ul>
      </section>
    </div>
  );
}
