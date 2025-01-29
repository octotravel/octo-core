import { PricingUnit, UnitType } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { PricingUnitHelper } from '../PricingUnitHelper';

describe('PricingUnitHelper', () => {
  describe('filterFirstUnitPricing', () => {
    it('should return an empty array when given an empty array', () => {
      const filteredPricingUnits = PricingUnitHelper.filterFirstUnitPricing([]);
      expect(filteredPricingUnits).toEqual([]);
    });

    it('should return the same array when all unit IDs are unique', () => {
      const expectedPricingUnits: PricingUnit[] = [
        {
          unitId: '1',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '2',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
        {
          unitId: '3',
          original: 30,
          retail: 35,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.INFANT,
        },
      ];
      const filteredPricingUnits = PricingUnitHelper.filterFirstUnitPricing(expectedPricingUnits);
      expect(filteredPricingUnits).toEqual(expectedPricingUnits);
    });

    it('should filter out duplicate unit IDs and keep only the first occurrence', () => {
      const pricingUnits: PricingUnit[] = [
        {
          unitId: '1',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '2',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
        {
          unitId: '1',
          original: 30,
          retail: 35,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
      ];
      const expectedPricingUnits: PricingUnit[] = [
        {
          unitId: '1',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '2',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
      ];
      const filteredPricingUnits = PricingUnitHelper.filterFirstUnitPricing(pricingUnits);
      expect(filteredPricingUnits).toEqual(expectedPricingUnits);
    });
  });
});
