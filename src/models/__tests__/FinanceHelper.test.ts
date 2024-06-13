import { describe, expect, it } from 'vitest';
import { FinanceHelper } from '../FinanceHelper';

describe('FinanceHelper', () => {
  const financeHelper = new FinanceHelper();

  describe('bankersRounding', () => {
    it('should round the value using bankers rounding', () => {
      // Test case 1
      expect(financeHelper.bankersRounding(1.4)).toBe(1);

      // Test case 2
      expect(financeHelper.bankersRounding(1.5)).toBe(2);

      // Test case 3
      expect(financeHelper.bankersRounding(1.6)).toBe(2);

      // Test case 4
      expect(financeHelper.bankersRounding(2.5)).toBe(2);

      // Test case 5
      expect(financeHelper.bankersRounding(2.6)).toBe(3);
    });

    it('should round the value to the specified decimal places', () => {
      // Test case 6
      expect(financeHelper.bankersRounding(1.23456789, 2)).toBe(1.23);

      // Test case 7
      expect(financeHelper.bankersRounding(1.23556789, 2)).toBe(1.24);

      // Test case 8
      expect(financeHelper.bankersRounding(1.23656789, 2)).toBe(1.24);
    });
  });
});
