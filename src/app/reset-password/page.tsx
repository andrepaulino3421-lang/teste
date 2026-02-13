'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageShell } from '@/components/page-shell';

export default function ResetPasswordPage() {
  const token = useSearchParams().get('token') ?? '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || 'Erro ao redefinir senha');
    setMessage('Senha atualizada com sucesso.');
    setTimeout(() => router.push('/login'), 1000);
  }

  return (
    <PageShell title="Redefinir senha">
      <form className="space-y-3 rounded bg-white p-4 shadow" onSubmit={onSubmit}>
        <input type="password" className="w-full rounded border p-2" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Salvar nova senha</button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </PageShell>
  );
}
