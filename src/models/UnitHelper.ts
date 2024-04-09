import { Unit } from '@octocloud/types';

export class UnitHelper {
  public static getUniqueUnitsByType = (units: Unit[]): Unit[] => {
    const usedUnitTypes: string[] = [];
    const filteredUnits: Unit[] = [];

    for (const unit of units) {
      if (!usedUnitTypes.includes(unit.type)) {
        filteredUnits.push(unit);
        usedUnitTypes.push(unit.type);
      }
    }

    return filteredUnits;
  };
}
