import { Pricing } from '@octocloud/types';

export interface Price {
  original: number;
  retail: number;
}

export abstract class PriceHelper {
  public static calculatePrice = (
    pricing: Pricing & { offerDiscount?: { original: number; retail: number } },
  ): Price => {
    if (pricing.offerDiscount) {
      return {
        original: pricing.original + pricing.offerDiscount.original,
        retail: pricing.retail + pricing.offerDiscount.retail,
      };
    }

    return {
      original: pricing.original,
      retail: pricing.retail,
    };
  };
}
