'use client';

import { useEffect, useState } from 'react';

const empty = {
  channel: 'STORE',
  name: '',
  isDefault: false,
  config: {
    channel: 'STORE', cogs: 20, packaging: 2, overheadType: 'MONEY', overheadValue: 3,
    taxesPercent: 8, marketingCPA: 0, shippingSubsidized: false, shippingCost: 0,
    paymentFeePercent: 3, paymentFeeFixed: 0.5, platformFeePercent: 0,
    desiredMarginMode: 'MARKUP', desiredValue: 2.2
  }
};

export default function PresetsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/presets');
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function createPreset() {
    const payload = { ...form, config: { ...form.config, channel: form.channel } };
    const res = await fetch('/api/presets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setMsg(res.ok ? 'Preset criado.' : data.error || 'Erro ao criar preset');
    if (res.ok) load();
  }

  async function removePreset(id: string) {
    await fetch(`/api/presets/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-4">
      <section className="rounded bg-white p-4 shadow space-y-2">
        <h2 className="font-semibold">Novo preset</h2>
        <div className="grid md:grid-cols-3 gap-2">
          <select className="rounded border p-2" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}><option value="STORE">STORE</option><option value="MARKETPLACE">MARKETPLACE</option><option value="RESTAURANT">RESTAURANT</option></select>
          <input className="rounded border p-2" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />Default</label>
        </div>
        <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={createPreset}>Criar preset</button>
        {msg && <p className="text-sm">{msg}</p>}
      </section>

      <section className="rounded bg-white p-4 shadow">
        <h3 className="font-semibold mb-2">Seus presets</h3>
        <ul className="space-y-2 text-sm">
          {items.map((p) => (
            <li key={p.id} className="flex justify-between border rounded p-2">
              <span>{p.channel} · {p.name} {p.isDefault ? '(default)' : ''}</span>
              <button className="text-red-600" onClick={() => removePreset(p.id)}>Excluir</button>
            </li>
          ))}
          {!items.length && <li>Nenhum preset cadastrado.</li>}
        </ul>
      </section>
    </div>
  );
}
