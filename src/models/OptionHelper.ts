import { Option, Unit, UnitType } from "@octocloud/types";
import { InvalidUnitError, InvalidUnitsError, OptionRestrictionsError } from "./Error";

type AvailabilityUnit = {
  id: string;
  quantity: number;
};

export class OptionHelper {
  /**
   * @throws {InvalidUnitsError}
   */
  public static checkUnits = (option: Option, units: Array<AvailabilityUnit>): void => {
    const invalidUnits = units.reduce((acc: Array<string>, unit) => {
      try {
        this.getUnitByID(option, unit.id);
      } catch (error) {
        if (error instanceof InvalidUnitError) {
          return [...acc, unit.id];
        }
      }

      return acc;
    }, []);

    const areUnitsOk = invalidUnits.length === 0;
    if (!areUnitsOk) {
      throw new InvalidUnitsError(invalidUnits);
    }
  };

  /**
   * @throws {InvalidUnitError}
   */
  public static getUnitByID = (option: Option, unitId: string): Unit => {
    const unit = option.units.find((unit) => unit.id === unitId) ?? null;
    if (unit === null) {
      throw new InvalidUnitError(unitId);
    }
    return unit;
  };

  /**
   * @throws {InvalidUnitError}
   */
  public static getUnitByType = (option: Option, unitType: UnitType): Unit => {
    const unit = option.units.find((unit) => unit.type === unitType) ?? null;
    if (unit === null) {
      throw new InvalidUnitError(unitType);
    }
    return unit;
  };

  /**
   * @throws {OptionRestrictionsError, InvalidUnitError}
   */
  public static checkRestrictions = (option: Option, units: Array<AvailabilityUnit>): void => {
    const count = units.reduce((acc, unit) => acc + unit.quantity, 0);
    const isMinOk = option.restrictions.minUnits <= count && count > 0;
    const isMaxOk = option.restrictions.maxUnits === null || option.restrictions.maxUnits >= count;

    units.forEach((unit) => {
      const octoUnit = option.units.find((u) => u.id === unit.id) ?? null;
      if (octoUnit === null) {
        throw new InvalidUnitError(unit.id);
      }
      if (octoUnit !== null) {
        const minQuantity: number | null = octoUnit.restrictions.minQuantity ?? null;
        const maxQuantity: number | null = octoUnit.restrictions.maxQuantity ?? null;
        const isMinOk = minQuantity === null || (minQuantity <= unit.quantity && unit.quantity > 0);
        const isMaxOk = maxQuantity === null || maxQuantity >= unit.quantity;

        const isAccompaniedByOk =
          octoUnit.restrictions.accompaniedBy.length === 0 ||
          octoUnit.restrictions.accompaniedBy.some((accompaniedBy) => units.map((u) => u.id).includes(accompaniedBy));
        const isOk = isMinOk && isMaxOk && isAccompaniedByOk;
        if (!isOk) {
          throw new OptionRestrictionsError({
            minUnits: minQuantity ?? 0,
            maxUnits: maxQuantity,
            unit: octoUnit,
            isAccompaniedByOk,
          });
        }
      }
    });

    const restrictions = [isMinOk, isMaxOk];
    const { minUnits, maxUnits } = option.restrictions;
    if (!restrictions.every(Boolean)) {
      throw new OptionRestrictionsError({
        minUnits,
        maxUnits,
      });
    }
  };
}
