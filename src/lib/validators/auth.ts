import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome inválido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

export const billingClaimSchema = z.object({
  purchaseEmail: z.string().email(),
  orderCode: z.string().max(120).optional().or(z.literal('')),
  note: z.string().max(500).optional().or(z.literal(''))
});
