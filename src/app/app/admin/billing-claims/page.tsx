'use client';

import { useEffect, useState } from 'react';

export default function AdminBillingClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);

  async function load() {
    const res = await fetch('/api/admin/billing-claims');
    if (res.ok) setClaims(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function process(id: string, action: 'approve' | 'reject') {
    await fetch(`/api/admin/billing-claims/${id}/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    load();
  }

  return (
    <section className="rounded bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-semibold">Claims pendentes</h2>
      <ul className="space-y-2 text-sm">
        {claims.map((c) => (
          <li key={c.id} className="border rounded p-2">
            <p>{c.user.email} — {c.purchaseEmail} — {c.orderCode || 'sem código'}</p>
            <div className="mt-2 space-x-2">
              <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => process(c.id, 'approve')}>Aprovar</button>
              <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => process(c.id, 'reject')}>Rejeitar</button>
            </div>
          </li>
        ))}
        {!claims.length && <li>Nenhum claim pendente.</li>}
      </ul>
    </section>
  );
}
