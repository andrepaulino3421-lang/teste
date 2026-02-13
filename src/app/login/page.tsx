'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', { redirect: false, email, password });
    if (result?.error) {
      setError('Email ou senha inválidos.');
      return;
    }
    router.push('/app/dashboard');
  }

  return (
    <PageShell title="Entrar">
      <form className="space-y-3 rounded bg-white p-4 shadow" onSubmit={onSubmit}>
        <input data-testid="login-email" className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input data-testid="login-password" type="password" className="w-full rounded border p-2" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button data-testid="login-submit" className="rounded bg-blue-600 px-4 py-2 text-white">Entrar</button>
        <div className="text-sm">
          <Link href="/forgot-password" className="text-blue-600 underline">Esqueci minha senha</Link>
        </div>
      </form>
    </PageShell>
  );
}
