import { AvailabilityUnit, BookingUnitItem } from '@octocloud/types';

export class UnitItemsHelper {
  public static mapFromAvailabilityUnits = (units: AvailabilityUnit[]): BookingUnitItem[] => {
    return units.reduce((acc: BookingUnitItem[], unit) => {
      const arr = new Array<{ unitId: string }>(unit.quantity).fill({
        unitId: unit.id,
      });
      return [...acc, ...arr];
    }, []);
  };

  public static mapUnitIdsToAvailabilityUnits = (units: string[]): AvailabilityUnit[] => {
    const unitIdCount = units.reduce((acc: Record<string, number>, unitId: string) => {
      if (acc[unitId]) {
        acc[unitId] += 1;
      } else {
        acc[unitId] = 1;
      }
      return acc;
    }, {});

    return Object.keys(unitIdCount).map((key) => ({
      quantity: unitIdCount[key],
      id: key,
    }));
  };
}
