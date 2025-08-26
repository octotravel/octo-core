import { PartialPricing, PricingModelGenerator, PricingParser } from '@octocloud/generators';
import { CapabilityId, Currency } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { PriceHelper } from '../PriceHelper';

describe('PricingHelper', () => {
  const pricingModelGenerator = new PricingModelGenerator();
  const pricingParser = new PricingParser();
  const pricingData: PartialPricing = {
    original: 1000,
    retail: 1000,
    net: 1000,
    includedTaxes: [],
    currency: Currency.EUR,
    currencyPrecision: 2,
    offerDiscount: {
      net: 500,
      retail: 500,
      includedTaxes: [],
    },
  };
  const pricingDataNetNull: PartialPricing = {
    ...pricingData,
    net: null,
    offerDiscount: {
      ...pricingData.offerDiscount!,
      net: null,
    },
  };
  const pricingModel = pricingModelGenerator.generatePricing({
    pricingData,
    capabilities: [],
  });
  const pricingNetNullModel = pricingModelGenerator.generatePricing({
    pricingData: pricingDataNetNull,
    capabilities: [],
  });
  const pricingModelWithOffers = pricingModelGenerator.generatePricing({
    pricingData,
    capabilities: [CapabilityId.Offers],
  });
  const pricingNetNulModelWithOffers = pricingModelGenerator.generatePricing({
    pricingData: pricingDataNetNull,
    capabilities: [CapabilityId.Offers],
  });

  const pricing = pricingParser.parseModelToPOJO(pricingModel);
  const pricingNetNull = pricingParser.parseModelToPOJO(pricingNetNullModel);
  const pricingWithOffer = pricingParser.parseModelToPOJO(pricingModelWithOffers);
  const pricingNetNullWithOffer = pricingParser.parseModelToPOJO(pricingNetNulModelWithOffers);

  describe('calculatePrice', () => {
    it('should calculate price', async () => {
      const price = PriceHelper.calculatePrice(pricing);
      expect(price.original).toBe(1000);
      expect(price.net).toBe(1000);
      expect(price.retail).toBe(1000);
    });

    it('should calculate price when net is null', async () => {
      const price = PriceHelper.calculatePrice(pricingNetNull);
      expect(price.original).toBe(1000);
      expect(price.net).toBe(null);
      expect(price.retail).toBe(1000);
    });

    it('should calculate price with offer', async () => {
      const price = PriceHelper.calculatePrice(pricingWithOffer);
      expect(price.original).toBe(1000);
      expect(price.net).toBe(1500);
      expect(price.retail).toBe(1500);
    });

    it('should calculate price with offer when net is null', async () => {
      const price = PriceHelper.calculatePrice(pricingNetNullWithOffer);
      expect(price.original).toBe(1000);
      expect(price.net).toBe(null);
      expect(price.retail).toBe(1500);
    });
  });
});
