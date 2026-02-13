import Link from 'next/link';

export default function AdminPage() {
  return (
    <section className="rounded bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Painel Admin</h2>
      <div className="mt-2 space-x-4">
        <Link className="text-blue-600 underline" href="/app/admin/users">Usuários</Link>
        <Link className="text-blue-600 underline" href="/app/admin/billing-claims">Billing Claims</Link>
      </div>
    </section>
  );
}
