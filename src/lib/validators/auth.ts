import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const billingClaimSchema = z.object({
  purchaseEmail: z.string().email(),
  orderCode: z.string().optional(),
  note: z.string().max(500).optional()
});
