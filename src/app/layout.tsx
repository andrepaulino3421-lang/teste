import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PrecificaPro',
  description: 'SaaS de precificação para loja, marketplace e restaurante'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
