import { PricingUnit } from '@octocloud/types';

export class PricingUnitHelper {
  public static filterFirstUnitPricing = (pricingUnits: PricingUnit[]): PricingUnit[] => {
    const usedUnitIds: string[] = [];
    const filteredUnitPricings: PricingUnit[] = [];

    for (const pricingUnit of pricingUnits) {
      if (!usedUnitIds.includes(pricingUnit.unitId)) {
        filteredUnitPricings.push(pricingUnit);
        usedUnitIds.push(pricingUnit.unitId);
      }
    }

    return filteredUnitPricings;
  };
}
