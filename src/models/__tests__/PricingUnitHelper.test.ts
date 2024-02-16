import { PricingUnit } from '@octocloud/types';
import { PricingUnitHelper } from '../PricingUnitHelper';

describe('PricingUnitHelper', () => {
  describe('filterUnits', () => {
    it('should filter out duplicate units', () => {
      const units: PricingUnit[] = [
        {
            unitId: 'adult',
            original: 13500,
            retail: 13500,
            net: 9787,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'adult',
            original: 500,
            retail: 500,
            net: 87,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'child',
            original: 13500,
            retail: 13500,
            net: 9787,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'child',
            original: 500,
            retail: 500,
            net: 87,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'infant',
            original: 13500,
            retail: 13500,
            net: 9787,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'student',
            original: 1500,
            retail: 1500,
            net: 87,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'adult',
            original: 0,
            retail: 0,
            net: 0,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        }
      ];

      const filteredUnits = PricingUnitHelper.filterUnits(units);

      expect(filteredUnits).toEqual([
        {
            unitId: 'adult',
            original: 13500,
            retail: 13500,
            net: 9787,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'child',
            original: 13500,
            retail: 13500,
            net: 9787,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'infant',
            original: 13500,
            retail: 13500,
            net: 9787,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
        {
            unitId: 'student',
            original: 1500,
            retail: 1500,
            net: 87,
            currency: 'USD',
            currencyPrecision: 2,
            includedTaxes: [],
        },
      ]);
    });

    it('should return an empty array if no units are provided', () => {
      const units: PricingUnit[] = [];

      const filteredUnits = PricingUnitHelper.filterUnits(units);

      expect(filteredUnits).toEqual([]);
    });
  });
});