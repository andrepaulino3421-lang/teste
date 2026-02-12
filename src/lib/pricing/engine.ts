import Decimal from 'decimal.js';

export type DesiredMarginMode = 'MARKUP' | 'NET_MARGIN';

export type PricingInput = {
  cogs: number;
  packaging: number;
  overhead: { type: 'MONEY' | 'PERCENT'; value: number };
  taxesPercent: number;
  marketingCPA?: number;
  shipping: { subsidized: boolean; subsidizedCost?: number };
  paymentFee: { percent: number; fixed: number };
  platformFeePercent: number;
  desiredMarginMode: DesiredMarginMode;
  desiredValue: number;
};

export type PricingOutput = {
  recommendedPrice: number;
  netProfit: number;
  netMarginPercent: number;
  totalFeesMoney: number;
  breakdown: Record<string, number>;
  alerts: string[];
};

export function calculatePricing(input: PricingInput): PricingOutput {
  const baseCost = new Decimal(input.cogs).plus(input.packaging);
  const overhead = input.overhead.type === 'MONEY'
    ? new Decimal(input.overhead.value)
    : baseCost.mul(new Decimal(input.overhead.value).div(100));
  const shipping = input.shipping.subsidized ? new Decimal(input.shipping.subsidizedCost ?? 0) : new Decimal(0);
  const marketing = new Decimal(input.marketingCPA ?? 0);

  const staticCosts = baseCost.plus(overhead).plus(shipping).plus(marketing);

  let price: Decimal;
  if (input.desiredMarginMode === 'MARKUP') {
    price = staticCosts.mul(input.desiredValue);
  } else {
    const feePercent = new Decimal(input.taxesPercent)
      .plus(input.paymentFee.percent)
      .plus(input.platformFeePercent)
      .div(100);
    const targetMargin = new Decimal(input.desiredValue);
    const denominator = new Decimal(1).minus(feePercent).minus(targetMargin);
    if (denominator.lte(0)) {
      throw new Error('Configuração inválida: margem alvo + taxas excedem 100%.');
    }
    price = staticCosts.plus(input.paymentFee.fixed).div(denominator);
  }

  const taxes = price.mul(input.taxesPercent).div(100);
  const platformFee = price.mul(input.platformFeePercent).div(100);
  const paymentPercent = price.mul(input.paymentFee.percent).div(100);
  const paymentFixed = new Decimal(input.paymentFee.fixed);

  const totalFees = taxes.plus(platformFee).plus(paymentPercent).plus(paymentFixed);
  const totalCosts = staticCosts.plus(totalFees);
  const profit = price.minus(totalCosts);
  const netMarginPercent = price.eq(0) ? new Decimal(0) : profit.div(price).mul(100);

  const alerts: string[] = [];
  if (profit.lt(0)) alerts.push('Margem líquida negativa.');
  if (totalFees.div(price).gte(0.35)) alerts.push('Taxas totais acima de 35% do preço.');
  if (shipping.gt(0) && shipping.div(price).gte(0.15)) alerts.push('Frete subsidiado está consumindo boa parte da margem.');

  return {
    recommendedPrice: price.toDecimalPlaces(2).toNumber(),
    netProfit: profit.toDecimalPlaces(2).toNumber(),
    netMarginPercent: netMarginPercent.toDecimalPlaces(2).toNumber(),
    totalFeesMoney: totalFees.toDecimalPlaces(2).toNumber(),
    breakdown: {
      cogs: input.cogs,
      packaging: input.packaging,
      overhead: overhead.toDecimalPlaces(2).toNumber(),
      marketing: marketing.toDecimalPlaces(2).toNumber(),
      shipping: shipping.toDecimalPlaces(2).toNumber(),
      taxes: taxes.toDecimalPlaces(2).toNumber(),
      paymentPercent: paymentPercent.toDecimalPlaces(2).toNumber(),
      paymentFixed: paymentFixed.toNumber(),
      platformFee: platformFee.toDecimalPlaces(2).toNumber()
    },
    alerts
  };
}
