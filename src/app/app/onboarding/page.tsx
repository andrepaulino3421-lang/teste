'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [channel, setChannel] = useState('STORE');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function save() {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel })
    });
    if (!res.ok) return setMsg('Erro ao salvar canal padrão.');
    setMsg('Canal salvo!');
    setTimeout(() => router.push('/app/dashboard'), 500);
  }

  return (
    <section className="rounded bg-white p-4 shadow space-y-3">
      <h2 className="text-lg font-semibold">Escolha seu canal padrão</h2>
      <select value={channel} onChange={(e) => setChannel(e.target.value)} className="rounded border p-2">
        <option value="STORE">Loja própria</option>
        <option value="MARKETPLACE">Marketplace</option>
        <option value="RESTAURANT">Restaurante / Delivery</option>
      </select>
      <div><button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={save}>Salvar</button></div>
      {msg && <p className="text-sm">{msg}</p>}
    </section>
  );
}
