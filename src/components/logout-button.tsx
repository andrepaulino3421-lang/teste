'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      data-testid="logout-btn"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="rounded border px-3 py-1"
    >
      Sair
    </button>
  );
}
