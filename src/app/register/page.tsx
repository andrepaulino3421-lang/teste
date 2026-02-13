'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error?.fieldErrors ? 'Dados inválidos.' : data.error || 'Erro no cadastro.');
      setLoading(false);
      return;
    }

    await signIn('credentials', { redirect: false, email, password });
    router.push('/app/onboarding');
  }

  return (
    <PageShell title="Criar conta">
      <form className="space-y-3 rounded bg-white p-4 shadow" onSubmit={onSubmit}>
        <input data-testid="register-name" className="w-full rounded border p-2" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="register-email" className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input data-testid="register-password" type="password" className="w-full rounded border p-2" placeholder="Senha (mínimo 8)" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button data-testid="register-submit" disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white">{loading ? 'Criando...' : 'Criar conta'}</button>
      </form>
    </PageShell>
  );
}
