import { describe, expect, it } from 'vitest';
import { calculatePricing } from './engine';

describe('calculatePricing', () => {
  it('calcula markup considerando taxas', () => {
    const result = calculatePricing({
      cogs: 20,
      packaging: 2,
      overhead: { type: 'MONEY', value: 3 },
      taxesPercent: 8,
      shipping: { subsidized: false },
      paymentFee: { percent: 3, fixed: 0.5 },
      platformFeePercent: 5,
      desiredMarginMode: 'MARKUP',
      desiredValue: 2.2
    });

    expect(result.recommendedPrice).toBeGreaterThan(55);
    expect(result.netProfit).toBeGreaterThan(20);
  });

  it('calcula por margem líquida alvo', () => {
    const result = calculatePricing({
      cogs: 35,
      packaging: 3,
      overhead: { type: 'PERCENT', value: 10 },
      taxesPercent: 10,
      shipping: { subsidized: true, subsidizedCost: 5 },
      paymentFee: { percent: 4, fixed: 0.4 },
      platformFeePercent: 16,
      desiredMarginMode: 'NET_MARGIN',
      desiredValue: 0.2
    });

    expect(result.netMarginPercent).toBeGreaterThan(19);
  });

  it('bloqueia configuração inválida de margem + taxas', () => {
    expect(() => calculatePricing({
      cogs: 10,
      packaging: 1,
      overhead: { type: 'MONEY', value: 2 },
      taxesPercent: 50,
      shipping: { subsidized: false },
      paymentFee: { percent: 30, fixed: 0 },
      platformFeePercent: 10,
      desiredMarginMode: 'NET_MARGIN',
      desiredValue: 0.2
    })).toThrow('Configuração inválida');
  });

  it('gera alertas relevantes', () => {
    const result = calculatePricing({
      cogs: 40,
      packaging: 5,
      overhead: { type: 'MONEY', value: 10 },
      taxesPercent: 18,
      shipping: { subsidized: true, subsidizedCost: 20 },
      paymentFee: { percent: 5, fixed: 2 },
      platformFeePercent: 20,
      desiredMarginMode: 'MARKUP',
      desiredValue: 1.1
    });

    expect(result.alerts.length).toBeGreaterThan(0);
  });
});
