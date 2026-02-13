import { z } from 'zod';

export const pricingInputSchema = z.object({
  channel: z.enum(['STORE', 'MARKETPLACE', 'RESTAURANT']),
  cogs: z.number().nonnegative(),
  packaging: z.number().nonnegative(),
  overheadType: z.enum(['MONEY', 'PERCENT']),
  overheadValue: z.number().nonnegative(),
  taxesPercent: z.number().min(0),
  marketingCPA: z.number().min(0),
  shippingSubsidized: z.boolean(),
  shippingCost: z.number().min(0),
  paymentFeePercent: z.number().min(0),
  paymentFeeFixed: z.number().min(0),
  platformFeePercent: z.number().min(0),
  desiredMarginMode: z.enum(['MARKUP', 'NET_MARGIN']),
  desiredValue: z.number().positive()
});

export const presetSchema = z.object({
  channel: z.enum(['STORE', 'MARKETPLACE', 'RESTAURANT']),
  name: z.string().min(2).max(80),
  config: pricingInputSchema,
  isDefault: z.boolean().default(false)
});
