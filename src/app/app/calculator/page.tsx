'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculatePricing, type PricingInput } from '@/lib/pricing/engine';

type Channel = 'STORE' | 'MARKETPLACE' | 'RESTAURANT';

type FormState = {
  channel: Channel;
  cogs: number;
  packaging: number;
  overheadType: 'MONEY' | 'PERCENT';
  overheadValue: number;
  taxesPercent: number;
  marketingCPA: number;
  shippingSubsidized: boolean;
  shippingCost: number;
  paymentFeePercent: number;
  paymentFeeFixed: number;
  platformFeePercent: number;
  desiredMarginMode: 'MARKUP' | 'NET_MARGIN';
  desiredValue: number;
};

const initial: FormState = {
  channel: 'STORE', cogs: 20, packaging: 2, overheadType: 'MONEY', overheadValue: 3,
  taxesPercent: 8, marketingCPA: 0, shippingSubsidized: false, shippingCost: 0,
  paymentFeePercent: 3, paymentFeeFixed: 0.5, platformFeePercent: 0,
  desiredMarginMode: 'MARKUP', desiredValue: 2.2
};

export default function CalculatorPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [message, setMessage] = useState('');
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => { fetch('/api/presets').then((r) => r.json()).then(setPresets).catch(() => setPresets([])); }, []);

  const result = useMemo(() => calculatePricing({
    cogs: form.cogs,
    packaging: form.packaging,
    overhead: { type: form.overheadType, value: form.overheadValue },
    taxesPercent: form.taxesPercent,
    marketingCPA: form.marketingCPA,
    shipping: { subsidized: form.shippingSubsidized, subsidizedCost: form.shippingCost },
    paymentFee: { percent: form.paymentFeePercent, fixed: form.paymentFeeFixed },
    platformFeePercent: form.platformFeePercent,
    desiredMarginMode: form.desiredMarginMode,
    desiredValue: form.desiredValue
  } as PricingInput), [form, refreshTick]);

  const filteredPresets = presets.filter((p) => p.channel === form.channel);

  function applyPreset(id: string) {
    setSelectedPreset(id);
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setForm(preset.configJson);
  }

  async function saveCalculation() {
    const res = await fetch('/api/calculations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(res.ok ? 'Cálculo salvo no histórico.' : data.error || 'Erro ao salvar.');
  }

  return (
    <div className="space-y-4">
      <section className="rounded bg-white p-4 shadow grid md:grid-cols-3 gap-3">
        <select data-testid="calc-channel" className="rounded border p-2" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as Channel })}>
          <option value="STORE">Loja</option><option value="MARKETPLACE">Marketplace</option><option value="RESTAURANT">Restaurante</option>
        </select>
        <select className="rounded border p-2" value={selectedPreset} onChange={(e) => applyPreset(e.target.value)}>
          <option value="">Aplicar preset</option>
          {filteredPresets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="rounded border p-2" onClick={() => setRefreshTick((n) => n + 1)}>Calcular</button>

        <input data-testid="calc-cogs" type="number" className="rounded border p-2" value={form.cogs} onChange={(e) => setForm({ ...form, cogs: Number(e.target.value) })} placeholder="COGS" />
        <input type="number" className="rounded border p-2" value={form.packaging} onChange={(e) => setForm({ ...form, packaging: Number(e.target.value) })} placeholder="Packaging" />
        <input type="number" className="rounded border p-2" value={form.marketingCPA} onChange={(e) => setForm({ ...form, marketingCPA: Number(e.target.value) })} placeholder="Marketing CPA" />

        <select className="rounded border p-2" value={form.overheadType} onChange={(e) => setForm({ ...form, overheadType: e.target.value as any })}><option value="MONEY">Overhead R$</option><option value="PERCENT">Overhead %</option></select>
        <input type="number" className="rounded border p-2" value={form.overheadValue} onChange={(e) => setForm({ ...form, overheadValue: Number(e.target.value) })} placeholder="Overhead valor" />
        <input type="number" className="rounded border p-2" value={form.taxesPercent} onChange={(e) => setForm({ ...form, taxesPercent: Number(e.target.value) })} placeholder="Impostos %" />

        <input type="number" className="rounded border p-2" value={form.paymentFeePercent} onChange={(e) => setForm({ ...form, paymentFeePercent: Number(e.target.value) })} placeholder="Fee pagamento %" />
        <input type="number" className="rounded border p-2" value={form.paymentFeeFixed} onChange={(e) => setForm({ ...form, paymentFeeFixed: Number(e.target.value) })} placeholder="Fee pagamento fixo" />
        <input type="number" className="rounded border p-2" value={form.platformFeePercent} onChange={(e) => setForm({ ...form, platformFeePercent: Number(e.target.value) })} placeholder="Fee plataforma %" />

        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.shippingSubsidized} onChange={(e) => setForm({ ...form, shippingSubsidized: e.target.checked })} />Frete subsidiado</label>
        <input type="number" className="rounded border p-2" value={form.shippingCost} onChange={(e) => setForm({ ...form, shippingCost: Number(e.target.value) })} placeholder="Custo frete" />

        <select className="rounded border p-2" value={form.desiredMarginMode} onChange={(e) => setForm({ ...form, desiredMarginMode: e.target.value as any })}><option value="MARKUP">Markup</option><option value="NET_MARGIN">Margem líquida</option></select>
        <input type="number" className="rounded border p-2" value={form.desiredValue} onChange={(e) => setForm({ ...form, desiredValue: Number(e.target.value) })} placeholder="Valor desejado" />
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Preço recomendado</p><p className="text-2xl font-bold">R$ {result.recommendedPrice}</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Lucro líquido</p><p className="text-2xl font-bold">R$ {result.netProfit}</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Margem líquida</p><p className="text-2xl font-bold">{result.netMarginPercent}%</p></article>
        <article className="rounded bg-white p-4 shadow"><p className="text-sm">Total taxas</p><p className="text-2xl font-bold">R$ {result.totalFeesMoney}</p></article>
      </section>

      <pre className="rounded bg-slate-900 p-4 text-xs text-white overflow-x-auto">{JSON.stringify(result.breakdown, null, 2)}</pre>
      {result.alerts.map((alert) => <p key={alert} className="text-sm text-amber-700">⚠ {alert}</p>)}
      <button data-testid="calc-save" className="rounded bg-blue-600 px-4 py-2 text-white" onClick={saveCalculation}>Salvar no histórico</button>
      {message && <p data-testid="calc-message" className="text-sm">{message}</p>}
    </div>
  );
}
