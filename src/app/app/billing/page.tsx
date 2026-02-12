import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <section className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">Plano atual: FREE</h2>
        <Link href="https://pay.kiwify.com.br/SqMLyYc" className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-white">Assinar PRO</Link>
      </section>
      <section className="rounded bg-white p-4 shadow">
        <h3 className="font-semibold">Já paguei</h3>
        <p className="text-sm text-slate-600">Formulário para criar BillingClaim (purchaseEmail obrigatório, orderCode e observação opcionais).</p>
      </section>
    </div>
  );
}
