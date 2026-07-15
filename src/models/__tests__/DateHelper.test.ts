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

  describe('parseUnixTimestampToDate', () => {
    const expectedDate = new Date('2026-07-14T19:00:47.268Z');
    const timestamp = expectedDate.getTime() / 1000;

    it('should parse a numeric Unix timestamp in seconds', () => {
      expect(DateHelper.parseUnixTimestampToDate(timestamp)).toEqual(expectedDate);
    });

    it('should parse a Unix timestamp string in seconds', () => {
      expect(DateHelper.parseUnixTimestampToDate(timestamp.toString())).toEqual(expectedDate);
    });
  });
});
