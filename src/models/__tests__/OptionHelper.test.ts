import { fail } from 'node:assert';
import { Option, Unit, UnitType } from '@octocloud/types';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { InvalidUnitError, InvalidUnitsError, OptionRestrictionsError } from '../Error';
import { OptionHelper } from '../OptionHelper';

describe('OptionHelper', () => {
  let mockOption: Option;
  let adultUnit: Unit;
  let childUnit: Unit;
  let infantUnit: Unit;

  beforeEach(() => {
    adultUnit = mock<Unit>({
      id: 'adult-unit-id',
      type: UnitType.ADULT,
      restrictions: {
        minQuantity: 1,
        maxQuantity: 10,
        accompaniedBy: [],
      },
    });

    childUnit = mock<Unit>({
      id: 'child-unit-id',
      type: UnitType.CHILD,
      restrictions: {
        minQuantity: 0,
        maxQuantity: 5,
        accompaniedBy: ['adult-unit-id'],
      },
    });

    infantUnit = mock<Unit>({
      id: 'infant-unit-id',
      type: UnitType.INFANT,
      restrictions: {
        minQuantity: 0,
        maxQuantity: 2,
        accompaniedBy: ['adult-unit-id'],
      },
    });

    mockOption = mock<Option>({
      units: [adultUnit, childUnit],
      restrictions: {
        minUnits: 1,
        maxUnits: 15,
      },
    });
  });

  describe('checkUnits', () => {
    it('should not throw when all units are valid', () => {
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'child-unit-id', quantity: 3 },
      ];

      expect(() => {
        OptionHelper.checkUnits(mockOption, units);
      }).not.toThrow();
    });

    it('should throw InvalidUnitsError when there are invalid units', () => {
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'invalid-unit-id', quantity: 1 },
      ];

      expect(() => {
        OptionHelper.checkUnits(mockOption, units);
      }).toThrow(InvalidUnitsError);
    });

    it('should throw with the correct invalid unit IDs', () => {
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'invalid-id-1', quantity: 1 },
        { id: 'invalid-id-2', quantity: 1 },
      ];

      try {
        OptionHelper.checkUnits(mockOption, units);
        fail('Expected an error to be thrown');
      } catch (error) {
        if (error instanceof InvalidUnitsError) {
          expect(error.invalidUnits).toEqual(['invalid-id-1', 'invalid-id-2']);
        } else {
          fail('Expected error to be an instance of InvalidUnitsError');
        }
      }
    });
  });

  describe('getUnitByID', () => {
    it('should return the correct unit when a matching ID exists', () => {
      const result = OptionHelper.getUnitByID(mockOption, 'adult-unit-id');
      expect(result).toStrictEqual(adultUnit);
    });

    it('should throw InvalidUnitError when no matching unit ID exists', () => {
      expect(() => {
        OptionHelper.getUnitByID(mockOption, 'non-existent-id');
      }).toThrow(InvalidUnitError);
    });
  });

  describe('getUnitByType', () => {
    it('should return the correct unit when a matching type exists', () => {
      const result = OptionHelper.getUnitByType(mockOption, UnitType.ADULT);
      expect(result).toStrictEqual(adultUnit);
    });

    it('should throw InvalidUnitError when no matching unit type exists', () => {
      expect(() => {
        OptionHelper.getUnitByType(mockOption, UnitType.INFANT);
      }).toThrow(InvalidUnitError);
    });
  });

  describe('checkRestrictions', () => {
    it('should not throw when all restrictions are satisfied', () => {
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'child-unit-id', quantity: 3 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).not.toThrow();
    });

    it('should throw InvalidUnitError when unit does not exist', () => {
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'non-existent-id', quantity: 1 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).toThrow(InvalidUnitError);
    });

    it('should throw OptionRestrictionsError when total count is below min', () => {
      mockOption.restrictions.minUnits = 10;
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'child-unit-id', quantity: 3 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).toThrow(OptionRestrictionsError);
    });

    it('should throw OptionRestrictionsError when total count exceeds max', () => {
      mockOption.restrictions.maxUnits = 4;
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'child-unit-id', quantity: 3 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).toThrow(OptionRestrictionsError);
    });

    it('should throw OptionRestrictionsError when unit quantity is below min', () => {
      adultUnit.restrictions.minQuantity = 3;
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'child-unit-id', quantity: 3 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).toThrow(OptionRestrictionsError);
    });

    it('should throw OptionRestrictionsError when unit quantity exceeds max', () => {
      childUnit.restrictions.maxQuantity = 2;
      const units = [
        { id: 'adult-unit-id', quantity: 2 },
        { id: 'child-unit-id', quantity: 3 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).toThrow(OptionRestrictionsError);
    });

    it('should throw OptionRestrictionsError when accompaniedBy restriction is not satisfied', () => {
      mockOption.units = [childUnit, infantUnit];

      const units = [{ id: 'infant-unit-id', quantity: 1 }];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).toThrow(OptionRestrictionsError);
    });

    it('should not throw when accompaniedBy restriction is satisfied', () => {
      mockOption.units = [adultUnit, childUnit, infantUnit];

      const units = [
        { id: 'adult-unit-id', quantity: 1 },
        { id: 'infant-unit-id', quantity: 1 },
      ];

      expect(() => {
        OptionHelper.checkRestrictions(mockOption, units);
      }).not.toThrow();
    });
  });
});
