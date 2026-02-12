# PrecificaPro

SaaS de precificação em PT-BR para loja própria, marketplace e restaurante/delivery.

## Stack
- Next.js 14 + TypeScript + Tailwind
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Zod + decimal.js
- Vitest + Playwright

## Funcionalidades
- Login/registro com email e senha
- Dashboard, calculadora, presets, histórico, billing
- Planos FREE/PRO com paywall sem webhook
- BillingClaim manual para aprovação admin
- Painel admin para usuários e claims
- Engine de pricing em funções puras testáveis

## Rodando local
1. `npm install`
2. Suba o banco: `docker compose up -d`
3. Copie `.env.example` para `.env` e ajuste valores
4. `npx prisma migrate dev`
5. `npm run dev`

## Seed de admin
```bash
ADMIN_EMAIL=admin@precificapro.com ADMIN_PASSWORD=12345678 npm run prisma:seed
```

## Exportar ZIP para Replit (LOCAL, sem download no site)
1. `npm install`
2. `npx prisma migrate dev`
3. `npm run export:zip`
4. Pegue `dist/precificapro-replit.zip`
5. Replit → Create Repl → Import from ZIP → Run

### Fallback sem archiver
- mac/linux:
```bash
zip -r precificapro-replit.zip . -x "node_modules/*" ".next/*" ".git/*" ".env*" "dist/*" "prisma/dev.db"
```
- windows powershell:
```powershell
Compress-Archive -Path * -DestinationPath precificapro-replit.zip -Force
```

## Testes
- Unit: `npm run test`
- E2E smoke: `npm run test:e2e`
