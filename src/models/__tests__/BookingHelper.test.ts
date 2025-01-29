import { BookingModelGenerator, BookingParser } from '@octocloud/generators';
import { AvailabilityStatus, UnitItem, UnitType } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { BookingHelper } from '../BookingHelper';
import { InvalidUnitError } from '../Error';

describe('BookingHelper', () => {
  const bookingModelGenerator = new BookingModelGenerator();
  const bookingParser = new BookingParser();
  const bookingModel = bookingModelGenerator.generateBooking({
    bookingData: {
      availability: {
        id: '2023-01-03T09:15:00+01:00',
        localDateTimeStart: '2023-01-03T09:15:00+01:00',
        localDateTimeEnd: '2023-01-03T09:39:00+01:00',
        allDay: false,
        available: true,
        status: AvailabilityStatus.AVAILABLE,
        vacancies: null,
        capacity: null,
        maxUnits: null,
        utcCutoffAt: '18:00',
        openingHours: [],
      },
    },
  });
  const booking = bookingParser.parseModelToPOJO(bookingModel);

  describe('getUnitItemByType', () => {
    it('should return unit item', async () => {
      const unitItem = BookingHelper.getUnitItemByType(UnitType.ADULT, booking);
      expect(unitItem !== null);
    });

    it('should throw InvalidUnitError due to non existing unit item', async () => {
      const getUnitItemByType = (): UnitItem => {
        return BookingHelper.getUnitItemByType(UnitType.MILITARY, booking);
      };

      expect(getUnitItemByType).toThrowError(InvalidUnitError);
    });
  });
});
