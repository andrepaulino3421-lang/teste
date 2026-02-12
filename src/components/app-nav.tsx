import Link from 'next/link';

const links = [
  ['/app/dashboard', 'Dashboard'],
  ['/app/calculator', 'Calculadora'],
  ['/app/presets', 'Presets'],
  ['/app/history', 'Histórico'],
  ['/app/billing', 'Billing']
] as const;

export function AppNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-3 text-sm">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="rounded bg-white px-3 py-1 shadow">
          {label}
        </Link>
      ))}
    </nav>
  );
}
