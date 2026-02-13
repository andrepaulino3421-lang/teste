import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ include: { subscription: true }, orderBy: { createdAt: 'desc' } });

  return (
    <section className="rounded bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-semibold">Usuários</h2>
      <ul className="space-y-2 text-sm">
        {users.map((u) => <li className="border rounded p-2" key={u.id}>{u.email} — {u.role} — {u.subscription?.plan ?? 'FREE'} — {new Date(u.createdAt).toLocaleDateString('pt-BR')}</li>)}
      </ul>
    </section>
  );
}
