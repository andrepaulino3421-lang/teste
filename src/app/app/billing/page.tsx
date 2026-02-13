'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BillingPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  async function loadClaims() {
    const res = await fetch('/api/billing-claims');
    if (res.ok) setClaims(await res.json());
  }
  useEffect(() => { loadClaims(); }, []);

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/billing-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchaseEmail, orderCode, note })
    });
    const data = await res.json();
    setMsg(res.ok ? 'Solicitação enviada com sucesso.' : data.error || 'Erro ao enviar claim');
    if (res.ok) {
      setPurchaseEmail(''); setOrderCode(''); setNote(''); loadClaims();
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">Assinatura PRO</h2>
        <Link href="https://pay.kiwify.com.br/SqMLyYc" className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-white">Assinar PRO</Link>
      </section>
      <section className="rounded bg-white p-4 shadow">
        <h3 className="font-semibold">Já paguei</h3>
        <form className="space-y-2 mt-2" onSubmit={submitClaim}>
          <input className="w-full rounded border p-2" placeholder="Email usado na compra" value={purchaseEmail} onChange={(e) => setPurchaseEmail(e.target.value)} />
          <input className="w-full rounded border p-2" placeholder="Código do pedido (opcional)" value={orderCode} onChange={(e) => setOrderCode(e.target.value)} />
          <textarea className="w-full rounded border p-2" placeholder="Observação (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="rounded bg-slate-900 px-4 py-2 text-white">Enviar claim</button>
        </form>
        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </section>
      <section className="rounded bg-white p-4 shadow">
        <h3 className="font-semibold">Meus claims</h3>
        <ul className="text-sm mt-2 space-y-1">
          {claims.map((c) => <li key={c.id}>{new Date(c.createdAt).toLocaleString('pt-BR')} - {c.purchaseEmail} - <strong>{c.status}</strong></li>)}
          {!claims.length && <li>Nenhum claim enviado.</li>}
        </ul>
      </section>
    </div>
  );
}
