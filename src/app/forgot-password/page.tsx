'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setMessage('Se o email existir, enviamos instruções de reset.');
    if (data.devResetLink) setDevLink(data.devResetLink);
  }

  return (
    <PageShell title="Esqueci minha senha">
      <form className="space-y-3 rounded bg-white p-4 shadow" onSubmit={onSubmit}>
        <input className="w-full rounded border p-2" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Enviar link</button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
        {devLink && <a className="text-sm text-blue-600 underline" href={devLink}>Reset link (DEV)</a>}
      </form>
    </PageShell>
  );
}
