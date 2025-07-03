import { Availability, AvailabilityStatus } from '@octocloud/types';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AvailabilityHelper } from '../AvailabilityHelper';
import { DateHelper } from '../DateHelper';
import { NoAvailabilityError } from '../Error';

vi.mock('../DateHelper', () => ({
  DateHelper: {
    getDate: vi.fn(),
  },
}));

describe('AvailabilityHelper', () => {
  let mockAvailabilities: Availability[];

  beforeEach(() => {
    vi.resetAllMocks();

    mockAvailabilities = [
      {
        id: '1',
        localDateTimeStart: '2023-01-01T10:00:00',
        localDateTimeEnd: '2023-01-01T11:00:00',
        available: true,
        allDay: false,
        utcCutoffAt: '',
        status: AvailabilityStatus.AVAILABLE,
        vacancies: null,
        capacity: null,
        maxUnits: null,
        openingHours: [],
      },
      {
        id: '2',
        localDateTimeStart: '2023-01-02T10:00:00',
        localDateTimeEnd: '2023-01-02T11:00:00',
        available: false,
        allDay: false,
        utcCutoffAt: '',
        status: AvailabilityStatus.AVAILABLE,
        vacancies: null,
        capacity: null,
        maxUnits: null,
        openingHours: [],
      },
      {
        id: '3',
        localDateTimeStart: '2023-01-03T00:00:00',
        localDateTimeEnd: '2023-01-03T23:59:59',
        available: true,
        allDay: true,
        utcCutoffAt: '',
        status: AvailabilityStatus.AVAILABLE,
        vacancies: null,
        capacity: null,
        maxUnits: null,
        openingHours: [],
      },
    ];
  });

  describe('checkAvailability', () => {
    test('returns availability when exact match is found for specific time slot', () => {
      const dateString = '2023-01-01T10:00:00';

      const result = AvailabilityHelper.checkAvailability(mockAvailabilities, dateString);

      expect(result).toEqual(mockAvailabilities[0]);
    });

    test('returns availability when all-day match is found', () => {
      const dateString = '2023-01-03T12:00:00';

      vi.mocked(DateHelper.getDate).mockReturnValueOnce('2023-01-03').mockReturnValueOnce('2023-01-03');

      const result = AvailabilityHelper.checkAvailability(mockAvailabilities, dateString);

      expect(result).toEqual(mockAvailabilities[2]);
      expect(DateHelper.getDate).toHaveBeenCalledTimes(2);
    });

    test('throws NoAvailabilityError when no match is found', () => {
      const dateString = '2023-12-04T10:00:00';

      vi.mocked(DateHelper.getDate).mockReturnValueOnce('2023-01-03').mockReturnValueOnce('2023-12-04');

      expect(() => {
        AvailabilityHelper.checkAvailability(mockAvailabilities, dateString);
      }).toThrow(NoAvailabilityError);
    });

    test('throws NoAvailabilityError when match is found but not available', () => {
      const dateString = '2023-01-02T10:00:00';

      expect(() => {
        AvailabilityHelper.checkAvailability(mockAvailabilities, dateString);
      }).toThrow(NoAvailabilityError);
    });

    test('throws NoAvailabilityError when match is found but not available (duplicate)', () => {
      const dateString = '2023-01-02T10:00:00';

      expect(() => {
        AvailabilityHelper.checkAvailability(mockAvailabilities, dateString);
      }).toThrow(NoAvailabilityError);
    });

    test('handles empty availabilities array', () => {
      const dateString = '2023-01-01T10:00:00';

      expect(() => {
        AvailabilityHelper.checkAvailability([], dateString);
      }).toThrow(NoAvailabilityError);
    });
  });
});
