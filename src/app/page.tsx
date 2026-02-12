import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold">PrecificaPro</h1>
      <p className="mt-4 text-lg text-slate-700">Precifique com precisão para loja, marketplace e restaurante.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/register" className="rounded bg-blue-600 px-4 py-2 text-white">Começar grátis</Link>
        <Link href="/pricing" className="rounded border px-4 py-2">Ver planos</Link>
      </div>
    </main>
  );
}
