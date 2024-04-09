import { PricingUnit, Unit, UnitType } from '@octocloud/types';
import { UnitHelper } from '../UnitHelper';

describe('UnitHelper', () => {
  describe('getUniqueUnitsByType', () => {
    it('should return an empty array when given an empty array', () => {
      const filteredPricingUnits = UnitHelper.getUniqueUnitsByType([]);
      expect(filteredPricingUnits).toEqual([]);
    });

    it('should return the same array when all unit IDs are unique', () => {
      const expectedUnits: Unit[] = [
        {
          type: UnitType.ADULT,
          id: '1',
          internalName: 'Adult',
          reference: 'ADT',
          requiredContactFields: [],
          visibleContactFields: [],
          restrictions: {
            accompaniedBy: [],
            idRequired: false,
            maxAge: 99,
            maxQuantity: 99,
            minAge: 18,
            minQuantity: 1,
            paxCount: 1,
          },
        },
        {
          type: UnitType.CHILD,
          id: '2',
          internalName: 'Child',
          reference: 'ADT',
          requiredContactFields: [],
          visibleContactFields: [],
          restrictions: {
            accompaniedBy: [],
            idRequired: false,
            maxAge: 25,
            maxQuantity: 99,
            minAge: 18,
            minQuantity: 1,
            paxCount: 1,
          },
        },
        {
          type: UnitType.INFANT,
          id: '2',
          internalName: 'Infant',
          reference: 'ADT',
          requiredContactFields: [],
          visibleContactFields: [],
          restrictions: {
            accompaniedBy: [],
            idRequired: false,
            maxAge: 25,
            maxQuantity: 99,
            minAge: 18,
            minQuantity: 1,
            paxCount: 1,
          },
        },
      ];
      const filteredPricingUnits = UnitHelper.getUniqueUnitsByType(expectedUnits);
      expect(filteredPricingUnits).toEqual(expectedUnits);
    });
  });
});
