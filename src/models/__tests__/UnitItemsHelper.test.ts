import { AvailabilityUnit } from '@octocloud/types';
import { UnitItemsHelper } from '../UnitItemsHelper';
import { describe, expect, it } from 'vitest';

describe('UnitItemHelper', () => {
  const firstUnitId = 'firstUnitId';
  const firstUnitQuantity = 1;
  const secondUnitId = 'secondUnitId';
  const secondUnitQuantity = 3;

  const availabilityUnits: AvailabilityUnit[] = [
    {
      id: firstUnitId,
      quantity: firstUnitQuantity,
    },
    {
      id: secondUnitId,
      quantity: secondUnitQuantity,
    },
  ];

  const unitIds = [firstUnitId, firstUnitId, secondUnitId];

  describe('mapFromAvailabilityUnits', () => {
    it('should return unit schemas', async () => {
      const unitSchemas = UnitItemsHelper.mapFromAvailabilityUnits(availabilityUnits);
      expect(unitSchemas).toHaveLength(firstUnitQuantity + secondUnitQuantity);
    });
  });

  describe('mapUnitIdsToAvailabilityUnits', () => {
    it('should return availability units', async () => {
      const availabilityUnits = UnitItemsHelper.mapUnitIdsToAvailabilityUnits(unitIds);
      expect(availabilityUnits).toHaveLength(2);
    });
  });
});
