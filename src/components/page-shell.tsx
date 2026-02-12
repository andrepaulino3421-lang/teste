import Link from 'next/link';

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link href="/" className="text-sm text-blue-600 underline">Início</Link>
      </header>
      {children}
    </main>
  );
}
