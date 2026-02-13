# PrecificaPro

SaaS de precificação (PT-BR) para loja própria, marketplace e restaurante/delivery.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- PostgreSQL + Prisma
- NextAuth (Credentials)
- Zod + decimal.js
- Vitest + Playwright

## O que está funcional
- Cadastro, login e logout
- Recuperação de senha com token (email por SMTP opcional; em DEV mostra reset link)
- Área autenticada `/app/*` com dashboard, calculadora, presets, histórico, billing
- Paywall real no backend (FREE x PRO)
- Billing manual sem webhook (claim e aprovação admin)
- Admin RBAC em `/app/admin/*`
- Export CSV somente para PRO

## Regras de plano
- FREE: até 10 cálculos/mês, 1 preset por canal, sem export CSV
- PRO: ilimitado e export CSV
- Checkout PRO: `https://pay.kiwify.com.br/SqMLyYc`
- **Sem webhook** (ativação manual via claims)

## Setup local
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npm run prisma:seed`
7. `npm run dev`

## Seed admin
```bash
ADMIN_EMAIL=admin@precificapro.com ADMIN_PASSWORD=12345678 npm run prisma:seed
```

## Testes
```bash
npm run build
npm run test
npm run test:e2e
```

## Exportar ZIP para Replit (somente local)
- Gere localmente com: `npm run export:zip`
- Arquivo de saída: `dist/precificapro-replit.zip`
- Importe no Replit: Create Repl → Import from ZIP

> Importante: não existe rota/página no SaaS para download de ZIP.
