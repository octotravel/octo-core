import { PricingUnit } from '@octocloud/types';

export class PricingUnitHelper {
  public static filterFirstUnitPricing = (pricingUnits: PricingUnit[]): PricingUnit[] => {
    const usedUnitTypes: string[] = [];
    const filteredUnitPricings: PricingUnit[] = [];

    for (const pricingUnit of pricingUnits) {
      if (!usedUnitTypes.includes(pricingUnit.unitType)) {
        filteredUnitPricings.push(pricingUnit);
        usedUnitTypes.push(pricingUnit.unitType);
      }
    }

    return filteredUnitPricings;
  };
}
