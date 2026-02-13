import { AppNav } from '@/components/app-nav';
import { LogoutButton } from '@/components/logout-button';
import { getUserSubscription, requireUser } from '@/lib/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const sub = await getUserSubscription(user.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-4 flex items-center justify-between gap-4 rounded bg-white p-4 shadow">
        <div>
          <h1 className="text-2xl font-bold">PrecificaPro App</h1>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded px-3 py-1 text-xs font-semibold ${sub.plan === 'PRO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
            {sub.plan}
          </span>
          <LogoutButton />
        </div>
      </header>
      <AppNav isAdmin={user.role === 'ADMIN'} />
      {children}
    </main>
  );
}
