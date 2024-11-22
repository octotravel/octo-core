import { describe, expect, it } from 'vitest';
import { DateHelper } from '../DateHelper';

describe('DateHelper', () => {
  const date = '2023-12-01';
  const time = '00:00';
  const dateTime = `${date}T${time}`;
  const dateTimeIso = `${date}T${time}:00Z`;
  const timeZone = 'Europe/Prague';
  const convertedTimeZone = '+01:00';
  const dateTimeWithTimeZone = `${date}T${time}:00${convertedTimeZone}`;

  describe('getTime', () => {
    it('should return time', async () => {
      expect(DateHelper.getTime(dateTime)).toEqual(time);
    });
  });

  describe('getDate', () => {
    it('should return date', async () => {
      expect(DateHelper.getDate(dateTime)).toEqual(date);
    });
  });

  describe('toISOString', () => {
    it('should return iso string', async () => {
      expect(DateHelper.toISOString(new Date(date))).toEqual(dateTimeIso);
    });
  });

  describe('availabilityIdFormat', () => {
    it('should return date formatted as availability id', async () => {
      expect(DateHelper.availabilityIdFormat(date, timeZone)).toStrictEqual(dateTimeWithTimeZone);
      // expect(DateHelper.availabilityIdFormat(new Date(date), timeZone)).toStrictEqual(dateTimeWithTimeZone);
    });
  });
});
