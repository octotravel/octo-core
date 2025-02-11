import { TZDate, tz } from '@date-fns/tz';
import { UTCDate, utc } from '@date-fns/utc';
import { addHours, format, formatISO, parseISO, transpose } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateFactory } from '../DateFactory';

describe('DateFactory', () => {
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";
  beforeEach(() => {
    vi.setSystemTime(new Date('2025-02-05T11:15'));
  });

  afterEach(() => {
    vi.setSystemTime(new Date());
  });

  describe('createLocalDateNow', () => {
    it('should createLocalDateNow', async () => {
      expect(format(DateFactory.createLocalDateNow(), dateTimeFormat)).toEqual('2025-02-05T11:15:00+01:00');
      expect(format(DateFactory.createLocalDateNow('UTC'), dateTimeFormat)).toEqual('2025-02-05T10:15:00+00:00');
      expect(format(DateFactory.createLocalDateNow('America/Los_Angeles'), dateTimeFormat)).toEqual(
        '2025-02-05T02:15:00-08:00',
      );
      expect(format(DateFactory.createLocalDateNow('Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });
  });

  describe('createLocalDate', () => {
    it('should createLocalDate with string', async () => {
      expect(format(DateFactory.createLocalDate('2025-02-05T11:15'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
      expect(format(DateFactory.createLocalDate('2025-02-05T11:15', 'UTC'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+00:00',
      );
      expect(format(DateFactory.createLocalDate('2025-02-05T11:15', 'America/Los_Angeles'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00-08:00',
      );
      expect(format(DateFactory.createLocalDate('2025-02-05T11:15', 'Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });

    it('should createLocalDate with date', async () => {
      expect(format(DateFactory.createLocalDate(new Date()), dateTimeFormat)).toEqual('2025-02-05T11:15:00+01:00');
      expect(format(DateFactory.createLocalDate(new Date(), 'UTC'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+00:00',
      );
      expect(format(DateFactory.createLocalDate(new Date(), 'America/Los_Angeles'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00-08:00',
      );
      expect(format(DateFactory.createLocalDate(new Date(), 'Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });

    it('should createLocalDate with number', async () => {
      expect(format(DateFactory.createLocalDate(new Date().getTime()), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
      expect(format(DateFactory.createLocalDate(new Date().getTime(), 'UTC'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+00:00',
      );
      expect(format(DateFactory.createLocalDate(new Date().getTime(), 'America/Los_Angeles'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00-08:00',
      );
      expect(format(DateFactory.createLocalDate(new Date().getTime(), 'Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });
  });

  describe('convertToLocalDateInZone', () => {
    it('should convertToLocalDateInZone with string', async () => {
      expect(format(DateFactory.convertToLocalDateInZone('2025-02-05T11:15'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
      expect(format(DateFactory.convertToLocalDateInZone('2025-02-05T11:15', 'UTC'), dateTimeFormat)).toEqual(
        '2025-02-05T10:15:00+00:00',
      );
      expect(
        format(DateFactory.convertToLocalDateInZone('2025-02-05T11:15', 'America/Los_Angeles'), dateTimeFormat),
      ).toEqual('2025-02-05T02:15:00-08:00');
      expect(format(DateFactory.convertToLocalDateInZone('2025-02-05T11:15', 'Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });

    it('should convertToLocalDateInZone with date', async () => {
      expect(format(DateFactory.convertToLocalDateInZone(new Date()), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
      expect(format(DateFactory.convertToLocalDateInZone(new Date(), 'UTC'), dateTimeFormat)).toEqual(
        '2025-02-05T10:15:00+00:00',
      );
      expect(format(DateFactory.convertToLocalDateInZone(new Date(), 'America/Los_Angeles'), dateTimeFormat)).toEqual(
        '2025-02-05T02:15:00-08:00',
      );
      expect(format(DateFactory.convertToLocalDateInZone(new Date(), 'Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });

    it('should convertToLocalDateInZone with number', async () => {
      expect(format(DateFactory.convertToLocalDateInZone(new Date().getTime()), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
      expect(format(DateFactory.convertToLocalDateInZone(new Date().getTime(), 'UTC'), dateTimeFormat)).toEqual(
        '2025-02-05T10:15:00+00:00',
      );
      expect(
        format(DateFactory.convertToLocalDateInZone(new Date().getTime(), 'America/Los_Angeles'), dateTimeFormat),
      ).toEqual('2025-02-05T02:15:00-08:00');
      expect(format(DateFactory.createLocalDate(new Date().getTime(), 'Europe/Prague'), dateTimeFormat)).toEqual(
        '2025-02-05T11:15:00+01:00',
      );
    });
  });

  //   describe('convertLocalDateToUTC', () => {
  //     it('should convertLocalDateToUTC and compare date objects', async () => {
  //       expect(DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow())).toStrictEqual(
  //         DateFactory.createUTCDateNow(),
  //       );
  //       expect(DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow('UTC'))).toStrictEqual(
  //         DateFactory.createUTCDateNow(),
  //       );
  //       expect(DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow('America/Los_Angeles'))).toStrictEqual(
  //         DateFactory.createUTCDateNow(),
  //       );
  //       expect(DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow('Europe/Prague'))).toStrictEqual(
  //         DateFactory.createUTCDateNow(),
  //       );
  //     });
  //     it('should convertLocalDateToUTC and compare formated date objects', async () => {
  //       expect(DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow()).toISOString()).toStrictEqual(
  //         DateFactory.createUTCDateNow().toISOString(),
  //       );
  //       expect(DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow('UTC')).toISOString()).toStrictEqual(
  //         DateFactory.createUTCDateNow().toISOString(),
  //       );
  //       expect(
  //         DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow('America/Los_Angeles')).toISOString(),
  //       ).toStrictEqual(DateFactory.createUTCDateNow().toISOString());
  //       expect(
  //         DateFactory.convertLocalDateToUTC(DateFactory.createLocalDateNow('Europe/Prague')).toISOString(),
  //       ).toStrictEqual(DateFactory.createUTCDateNow().toISOString());
  //     });

  //     it.skip('should fap', async () => {
  //       console.log(format(new TZDate("2024-01-01", 'Europe/London'), 'yyyy-MM-dd'))
  //       expect(format(new TZDate("2024-01-01", 'Europe/London'), 'yyyy-MM-dd')).toBe('2024-01-01')

  //       // const dateInLocal = new TZDate('2025-02-05T11:15')
  //       // console.log('dateInLocal', dateInLocal, dateInLocal.toISOString())
  //       // const dateInZone = new TZDate('2025-02-05T11:15', 'America/Los_Angeles')
  //       // console.log('dateInZone', dateInZone, dateInZone.toISOString())

  //       // // const dateInLocalUTC = new UTCDate(dateInLocal)
  //       // // console.log('dateInLocalUTC', dateInLocalUTC, dateInLocalUTC.toISOString())
  //       // // const dateInZoneUTC = new UTCDate(dateInZone)
  //       // // console.log('dateInZoneUTC', dateInZoneUTC, dateInZoneUTC.toISOString())

  //       // const transposed = transpose(dateInZone, tz('Europe/Prague'))
  //       // console.log('transposed', transposed, transposed.toISOString())

  //       // const dateInLocalUTCBackToLocal = new TZDate(dateInLocalUTC, 'Europe/Prague')
  //       // console.log('dateInLocalUTCBackToLocal', dateInLocalUTCBackToLocal, dateInLocalUTCBackToLocal.toISOString(), format(dateInLocalUTCBackToLocal, dateTimeFormat, {in: tz("Europe/Prague")}))
  //       // console.log(formatISO(dateInLocalUTCBackToLocal, { in: tz('UTC') }))
  //       // const dateInZoneUTCBackToLocal = new TZDate(dateInZoneUTC, 'America/Los_Angeles')
  //       // console.log('dateInZoneUTCBackToLocal', dateInZoneUTCBackToLocal, dateInZoneUTCBackToLocal.toISOString(), format(dateInZoneUTCBackToLocal, dateTimeFormat, { in: tz("America/Los_Angeles")}), )
  //       // console.log(formatISO(dateInZoneUTCBackToLocal, { in: tz('UTC') }))
  //       // console.log('------------------------------------------------------------------------------------------')

  //       // const datetimeString = '2025-02-05T11:15';
  //       // const timeZone = 'America/Los_Angeles'
  //       // const timestamp = parseISO(datetimeString, { in: tz(timeZone) })

  //       // console.log('timestamp', timestamp, timestamp.toISOString())
  //       // const formattedTimestamp = formatISO(timestamp, { in: tz('UTC') })

  //       // console.log(formattedTimestamp)

  //       // const fap = parseISO(dateInZoneUTCBackToLocal.toISOString(), { in: tz('America/Los_Angeles')})
  //       // console.log('fap', fap, fap.toDateString(), fap.toISOString())

  //       // // expect(new TZDate('2025-02-05T11:15', 'America/Los_Angeles').toISOString()).toBe('2025-02-05T11:15:00.000Z')

  //       // const datetimeString = '2025-02-05T11:15';
  //       // const timeZone = 'America/Los_Angeles'
  //       // const timestamp = parseISO(datetimeString, { in: tz(timeZone) })
  //       // const timestampa = parseISO(datetimeString, { in: tz('UTC') })

  //       // console.log(timestamp, timestamp.toISOString())
  //       // console.log(timestampa, timestampa.toISOString())

  //       // const formattedTimestamp = formatISO(timestamp, { in: tz('UTC') })

  //       // expect(formattedTimestamp).toBe('')
  //       // const LATime = DateFactory.createLocalDateNow('America/Los_Angeles');

  //       // const convertedToUTC = DateFactory.convertLocalDateToUTC(LATime);
  //       // expect(format(LATime, dateTimeFormat)).toBe('2025-02-05T03:15');
  //       // expect(format(addHours(LATime, 3), dateTimeFormat)).toBe('2025-02-05T06:15');
  //       // expect(LATime.toISOString()).toBe('2025-02-05T03:15:00.000-08:00');
  //       // expect(addHours(LATime, 3).toISOString()).toBe('2025-02-05T06:15:00.000-08:00');

  //       // expect(convertedToUTC.toISOString()).toBe('2025-02-05T11:15:00.000Z');
  //       // expect(addHours(convertedToUTC, 3).toISOString()).toBe('2025-02-05T14:15:00.000Z');
  //     });
  //   });
  // });
});
