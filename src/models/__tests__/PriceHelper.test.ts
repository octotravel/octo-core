import { PricingModelGenerator, PricingParser } from "@octocloud/generators";
import { PriceHelper } from "../PriceHelper";
import { CapabilityId, Currency } from "@octocloud/types";

describe("PricingHelper", () => {
  const pricingModelGenerator = new PricingModelGenerator();
  const pricingParser = new PricingParser()
  const pricingData = {
    original: 1000,
    retail: 1000,
    net: 1000,
    includedTaxes: [],
    currency: Currency.EUR,
    currencyPrecision: 2,
    offerDiscount: {
      original: 500,
      retail: 500,
      includedTaxes: [],
    },
  }
  const pricingModel = pricingModelGenerator.generatePricing({
    pricingData,
    capabilities: []
  })
  const pricingModelWithOffers = pricingModelGenerator.generatePricing({
    pricingData,
    capabilities: [CapabilityId.Offers]
  })
  const pricing = pricingParser.parseModelToPOJO(pricingModel)
  const pricingWithOffer = pricingParser.parseModelToPOJO(pricingModelWithOffers)


  describe("calculatePrice", () => {
    it("should calculate price", async () => {
      const price = PriceHelper.calculatePrice(pricing);
      expect(price.original).toBe(1000);
      expect(price.retail).toBe(1000);
    });

    it("should calculate price with offer", async () => {
      const price = PriceHelper.calculatePrice(pricingWithOffer);
      expect(price.original).toBe(1500);
      expect(price.retail).toBe(1500);
    });
  });

});
