import { PricingUnit } from '@octocloud/types';

export class PricingUnitHelper {
  public static filterFirstUnitPricing = (pricingUnits: PricingUnit[]): PricingUnit[] => {
    const usedUnitIds: string[] = [];
    const filteredUnitPricings: PricingUnit[] = [];

    for (const unit of pricingUnits) {
      if (!usedUnitIds.includes(unit.unitId)) {
        filteredUnitPricings.push(unit);
        usedUnitIds.push(unit.unitId);
      }
    }

    return filteredUnitPricings;
  };
}
