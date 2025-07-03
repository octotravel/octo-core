import { Booking, UnitItem, UnitType } from '@octocloud/types';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { BookingHelper } from '../BookingHelper';
import { InvalidUnitError } from '../Error';

describe('BookingHelper', () => {
  describe('getUnitItemByType', () => {
    let mockBooking: Booking;
    let adultUnitItem: UnitItem;
    let childUnitItem: UnitItem;

    beforeEach(() => {
      adultUnitItem = mock<UnitItem>({
        unit: {
          type: UnitType.ADULT,
        },
      });

      childUnitItem = mock<UnitItem>({
        unit: {
          type: UnitType.CHILD,
        },
      });

      mockBooking = mock<Booking>({
        unitItems: [adultUnitItem, childUnitItem],
      });
    });

    it('should return the correct unit item when a matching type exists', () => {
      const result = BookingHelper.getUnitItemByType(UnitType.ADULT, mockBooking);
      expect(result).toStrictEqual(adultUnitItem);

      const childResult = BookingHelper.getUnitItemByType(UnitType.CHILD, mockBooking);
      expect(childResult).toStrictEqual(childUnitItem);
    });

    it('should throw InvalidUnitError when no matching unit type exists', () => {
      expect(() => {
        BookingHelper.getUnitItemByType(UnitType.INFANT, mockBooking);
      }).toThrow(InvalidUnitError);
    });

    it('should throw InvalidUnitError when booking has no unit items', () => {
      const emptyBooking = mock<Booking>({
        unitItems: [],
      });

      expect(() => {
        BookingHelper.getUnitItemByType(UnitType.ADULT, emptyBooking);
      }).toThrow(InvalidUnitError);
    });

    it('should handle case where some unit items might be undefined', () => {
      const bookingWithUndefined = mock<Booking>({
        unitItems: [undefined, adultUnitItem, undefined],
      });

      const result = BookingHelper.getUnitItemByType(UnitType.ADULT, bookingWithUndefined);
      expect(result).toStrictEqual(adultUnitItem);
    });
  });
});
