import { PricingUnit } from '@octocloud/types';

export abstract class PricingUnitHelper {
  public static filterUnits = (units: PricingUnit[]): PricingUnit[] => {
    const unitIds = new Set<string>();

    units.forEach((unit) => {
      unitIds.add(unit.unitId);
    });

    const uniqueUnits = Array.from(unitIds)
      .map((unitId) => {
        const unit = units.find((unit) => unit.unitId === unitId);
        if (unit) {
          return unit;
        }
        return null;
      })
      .filter(Boolean) as PricingUnit[];

    return uniqueUnits;
  };
}
