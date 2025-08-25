import { Pricing } from '@octocloud/types';

export interface Price {
  original: number;
  retail: number;
  net: number | null;
}

export abstract class PriceHelper {
  public static calculatePrice = (pricing: Pricing): Price => {
    if (pricing.offerDiscount) {
      return {
        original: pricing.original,
        net:
          pricing.net !== null && pricing.offerDiscount.net !== null ? pricing.net + pricing.offerDiscount.net : null,
        retail: pricing.retail + pricing.offerDiscount.retail,
      };
    }

    return {
      original: pricing.original,
      net: pricing.net,
      retail: pricing.retail,
    };
  };
}
