import { PricingUnit } from '@octocloud/types';
import { PricingUnitHelper } from '../PricingUnitHelper';

describe('PricingUnitHelper', () => {
  describe('filterFirstUnitPricing', () => {
    it('should return an empty array when given an empty array', () => {
      const result = PricingUnitHelper.filterFirstUnitPricing([]);
      expect(result).toEqual([]);
    });

    it('should return the same array when all unit IDs are unique', () => {
      const pricingUnits: PricingUnit[] = [
        { unitId: '1', original: 10, retail: 15, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
        { unitId: '2', original: 20, retail: 25, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
        { unitId: '3', original: 30, retail: 35, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
      ];
      const result = PricingUnitHelper.filterFirstUnitPricing(pricingUnits);
      expect(result).toEqual(pricingUnits);
    });

    it('should filter out duplicate unit IDs and keep only the first occurrence', () => {
      const pricingUnits: PricingUnit[] = [
        { unitId: '1', original: 10, retail: 15, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
        { unitId: '2', original: 20, retail: 25, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
        { unitId: '1', original: 30, retail: 35, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
      ];
      const expectedResult: PricingUnit[] = [
        { unitId: '1', original: 10, retail: 15, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
        { unitId: '2', original: 20, retail: 25, net: null, currency: 'USD', currencyPrecision: 2, includedTaxes: [] },
      ];
      const result = PricingUnitHelper.filterFirstUnitPricing(pricingUnits);
      expect(result).toEqual(expectedResult);
    });
  });
});
