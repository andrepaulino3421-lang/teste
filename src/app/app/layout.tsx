import { AppNav } from '@/components/app-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-4 text-2xl font-bold">PrecificaPro App</h1>
      <AppNav />
      {children}
    </main>
  );
}
