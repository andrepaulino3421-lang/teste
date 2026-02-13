import Link from 'next/link';

const links = [
  ['/app/dashboard', 'Dashboard'],
  ['/app/calculator', 'Calculadora'],
  ['/app/presets', 'Presets'],
  ['/app/history', 'Histórico'],
  ['/app/billing', 'Billing'],
  ['/app/settings', 'Configurações']
] as const;

export function AppNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-3 text-sm">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="rounded bg-white px-3 py-1 shadow">
          {label}
        </Link>
      ))}
      {isAdmin && (
        <Link href="/app/admin" className="rounded bg-indigo-100 px-3 py-1 shadow">Admin</Link>
      )}
    </nav>
  );
}
