import { TZDate, tz } from '@date-fns/tz';
import { UTCDate, utc } from '@date-fns/utc';
import { addHours, format, formatISO, parseISO, transpose } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateFactory } from '../DateFactory';
import { DateTZ } from '../DateTZ';

describe('DateTZ', () => {
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";
  const dateString = '2025-02-05T11:15:00';
  const timeZoneLA = 'America/Los_Angeles';
  const timeZonePrague = 'Europe/Prague';
  const timeZoneUTC = 'UTC';
  beforeEach(() => {
    vi.setSystemTime(new Date(dateString));
  });

  afterEach(() => {
    vi.setSystemTime(new Date());
  });

  describe('create DateTZ', () => {
    it('should create DateTZ', () => {
      expect(new DateTZ().format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(dateString).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(new Date()).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(new Date().getTime()).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(2025, 1).format(dateTimeFormat)).toBe('2025-02-01T00:00:00+01:00');
      expect(new DateTZ(2025, 1, 5).format(dateTimeFormat)).toBe('2025-02-05T00:00:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11).format(dateTimeFormat)).toBe('2025-02-05T11:00:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11, 15).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, 0).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');

      expect(DateTZ.tz(timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');
      expect(new DateTZ(dateString, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');
      expect(new DateTZ(new Date(), timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');
      expect(new DateTZ(new Date().getTime(), timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');
      expect(new DateTZ(2025, 1, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-01T00:00:00-08:00');
      expect(new DateTZ(2025, 1, 5, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T00:00:00-08:00');
      expect(new DateTZ(2025, 1, 5, 11, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:00:00-08:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, 0, timeZoneLA).format(dateTimeFormat)).toBe('2025-02-05T11:15:00-08:00');

      expect(DateTZ.tz(timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(dateString, timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(new Date(), timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(new Date().getTime(), timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(2025, 1, timeZonePrague).format(dateTimeFormat)).toBe('2025-02-01T00:00:00+01:00');
      expect(new DateTZ(2025, 1, 5, timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T00:00:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11, timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T11:00:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, timeZonePrague).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+01:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, timeZonePrague).format(dateTimeFormat)).toBe(
        '2025-02-05T11:15:00+01:00',
      );
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, 0, timeZonePrague).format(dateTimeFormat)).toBe(
        '2025-02-05T11:15:00+01:00',
      );

      expect(DateTZ.tz(timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+00:00');
      expect(new DateTZ(dateString, timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+00:00');
      expect(new DateTZ(new Date(), timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+00:00');
      expect(new DateTZ(new Date().getTime(), timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+00:00');
      expect(new DateTZ(2025, 1, timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-01T00:00:00+00:00');
      expect(new DateTZ(2025, 1, 5, timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T00:00:00+00:00');
      expect(new DateTZ(2025, 1, 5, 11, timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:00:00+00:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+00:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, timeZoneUTC).format(dateTimeFormat)).toBe('2025-02-05T11:15:00+00:00');
      expect(new DateTZ(2025, 1, 5, 11, 15, 0, 0, timeZoneUTC).format(dateTimeFormat)).toBe(
        '2025-02-05T11:15:00+00:00',
      );
    });

    it('should get internalDate', () => {
      expect(format(new DateTZ().internalDate, dateTimeFormat)).toEqual('2025-02-05T11:15:00+01:00');
      expect(format(new DateTZ(dateString).internalDate, dateTimeFormat)).toEqual('2025-02-05T11:15:00+01:00');

      expect(format(DateTZ.tz(timeZoneLA).internalDate, dateTimeFormat)).toEqual('2025-02-05T11:15:00-08:00');
      expect(format(new DateTZ(dateString, timeZoneLA).internalDate, dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00-08:00',
      );

      expect(format(DateTZ.tz(timeZonePrague).internalDate, dateTimeFormat)).toEqual('2025-02-05T11:15:00+01:00');
      expect(format(new DateTZ(dateString, timeZonePrague).internalDate, dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );

      expect(format(DateTZ.tz(timeZoneUTC).internalDate, dateTimeFormat)).toEqual('2025-02-05T11:15:00+00:00');
      expect(format(new DateTZ(dateString, timeZoneUTC).internalDate, dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+00:00',
      );
    });

    it('should get timeZone', () => {
      expect(new DateTZ().timeZone).toBe(null);
      expect(new DateTZ(dateString).timeZone).toBe(null);

      expect(DateTZ.tz(timeZoneLA).timeZone).toBe(timeZoneLA);
      expect(new DateTZ(dateString, timeZoneLA).timeZone).toBe(timeZoneLA);

      expect(DateTZ.tz(timeZonePrague).timeZone).toBe(timeZonePrague);
      expect(new DateTZ(dateString, timeZonePrague).timeZone).toBe(timeZonePrague);

      expect(DateTZ.tz(timeZoneUTC).timeZone).toBe(timeZoneUTC);
      expect(new DateTZ(dateString, timeZoneUTC).timeZone).toBe(timeZoneUTC);
    });

    it('should convert toUTC', () => {
      expect(new DateTZ(dateString, timeZonePrague).toUTC().timeZone).toBe(timeZoneUTC);
      expect(new DateTZ(dateString, timeZonePrague).toUTC().toISOString()).toBe('2025-02-05T10:15:00.000Z');

      expect(new DateTZ(dateString, timeZoneLA).toUTC().timeZone).toBe(timeZoneUTC);
      expect(new DateTZ(dateString, timeZoneLA).toUTC().toISOString()).toBe('2025-02-05T19:15:00.000Z');

      expect(new DateTZ(dateString, timeZoneUTC).toUTC().timeZone).toBe(timeZoneUTC);
      expect(new DateTZ(dateString, timeZoneUTC).toUTC().toISOString()).toBe('2025-02-05T11:15:00.000Z');
    });
  });
});
