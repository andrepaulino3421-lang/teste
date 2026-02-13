import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

const checkout = 'https://pay.kiwify.com.br/SqMLyYc';

export default function PricingPage() {
  return (
    <PageShell title="Planos">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded bg-white p-4 shadow">
          <h2 className="text-xl font-semibold">FREE</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Até 10 cálculos/mês</li><li>1 preset por canal</li><li>Sem exportação CSV</li>
          </ul>
        </section>
        <section className="rounded bg-white p-4 shadow">
          <h2 className="text-xl font-semibold">PRO</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Cálculos ilimitados</li><li>Presets ilimitados</li><li>Exportação CSV</li>
          </ul>
          <Link href={checkout} className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">Assinar PRO</Link>
        </section>
      </div>
    </PageShell>
  );
}
