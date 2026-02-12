'use client';

import { useMemo, useState } from 'react';
import { calculatePricing, type PricingInput } from '@/lib/pricing/engine';

const initial: PricingInput = {
  cogs: 20,
  packaging: 2,
  overhead: { type: 'MONEY', value: 3 },
  taxesPercent: 8,
  marketingCPA: 0,
  shipping: { subsidized: false, subsidizedCost: 0 },
  paymentFee: { percent: 3, fixed: 0.5 },
  platformFeePercent: 0,
  desiredMarginMode: 'MARKUP',
  desiredValue: 2.2
};

export default function CalculatorPage() {
  const [form, setForm] = useState<PricingInput>(initial);
  const output = useMemo(() => calculatePricing(form), [form]);

  return (
    <div className="space-y-4">
      <section className="grid gap-3 rounded bg-white p-4 shadow md:grid-cols-3">
        <input className="rounded border p-2" type="number" value={form.cogs} onChange={(e) => setForm({ ...form, cogs: Number(e.target.value) })} placeholder="COGS" />
        <input className="rounded border p-2" type="number" value={form.packaging} onChange={(e) => setForm({ ...form, packaging: Number(e.target.value) })} placeholder="Embalagem" />
        <input className="rounded border p-2" type="number" value={form.taxesPercent} onChange={(e) => setForm({ ...form, taxesPercent: Number(e.target.value) })} placeholder="Impostos %" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Preço recomendado</p><p className="text-2xl font-bold">R$ {output.recommendedPrice}</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Lucro líquido</p><p className="text-2xl font-bold">R$ {output.netProfit}</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Margem líquida</p><p className="text-2xl font-bold">{output.netMarginPercent}%</p></article>
      </section>

      <button className="rounded bg-blue-600 px-4 py-2 text-white">Salvar no histórico</button>
      {output.alerts.map((alert) => <p key={alert} className="text-sm text-amber-600">⚠ {alert}</p>)}
    </div>
  );
}
