import { describe, expect, it } from 'vitest';
import { PriceHelper } from '../PriceHelper';

describe('PricingHelper', () => {
  const pricingDataWithOffer = {
    original: 1000,
    retail: 1000,
    net: 1000,
    currency: 'EUR',
    includedTaxes: [],
    currencyPrecision: 2,
    offerDiscount: {
      original: 500,
      retail: 500,
      includedTaxes: [],
    },
  };

  const pricingDataWithoutOffer = {
    original: 1000,
    retail: 1000,
    net: 1000,
    currency: 'EUR',
    includedTaxes: [],
    currencyPrecision: 2,
  };

  describe('calculatePrice', () => {
    it('should calculate price', () => {
      const price = PriceHelper.calculatePrice(pricingDataWithoutOffer);
      expect(price.original).toBe(1000);
      expect(price.retail).toBe(1000);
    });

    it('should calculate price with offer', () => {
      const price = PriceHelper.calculatePrice(pricingDataWithOffer);
      expect(price.original).toBe(1500);
      expect(price.retail).toBe(1500);
    });
  });
});
