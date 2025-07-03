import { PricingUnit } from '@octocloud/types';
import { UnitType } from '@octocloud/types/src/models/UnitType';

export class PricingUnitHelper {
  public static filterFirstUnitPricing = (pricingUnits: (PricingUnit & { unitType: UnitType })[]): PricingUnit[] => {
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
