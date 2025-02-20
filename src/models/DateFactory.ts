import { TZDate, tz } from '@date-fns/tz';
import { UTCDate } from '@date-fns/utc';
import { format, parse, parseISO, transpose } from 'date-fns';

export abstract class DateFactory {
  /**
   * Constructs a new `TZDate` instance.
   *
   * @param tz timezone, when omited, system timezone is used (IANA or UTC offset)
   * @returns local date in sepcific timezone
   */
  public static createLocalDateNow(tz?: string): TZDate {
    if (tz) {
      return TZDate.tz(tz);
    }

    return new TZDate();
  }

  /**
   * Constructs a new `TZDate` instance with datetime in provided timezone.
   *
   * @param date date string | unix timestamp | Date object can be used
   * @param tz timezone, in which the date is created, when omited, system timezone is used (IANA or UTC offset)
   * @returns local date in sepcific timezone
   */
  public static createLocalDate(date: string | Date | number, timezone?: string): TZDate {
    if (typeof date === 'string') {
      if (timezone) {
        return parseISO(date, { in: tz(timezone) });
      }
      return parseISO(date);
    }
    if (typeof date === 'number') {
      if (timezone) {
        return parseISO(format(date, "yyyy-MM-dd'T'HH:mm"), { in: tz(timezone) });
      }
      return parseISO(format(date, "yyyy-MM-dd'T'HH:mm"));
    }
    if (timezone) {
      return parseISO(format(date, "yyyy-MM-dd'T'HH:mm"), { in: tz(timezone) });
    }
    return parseISO(format(date, "yyyy-MM-dd'T'HH:mm"));
  }

  /**
   * Constructs a new `TZDate` instance with datetime in provided timezone.
   *
   * @param date date string | unix timestamp | Date object can be used
   * @param tz timezone, in which the date is converted to, when omited, system timezone is used (IANA or UTC offset)
   * @returns local date in sepcific timezone
   */
  public static convertToLocalDateInZone(date: string | Date | number, timezone?: string): TZDate {
    if (typeof date === 'string') {
      return new TZDate(date, timezone);
    }
    if (typeof date === 'number') {
      return new TZDate(date, timezone);
    }
    return new TZDate(date, timezone);
  }

  /**
   * Constructs a new `UTCDate` instance.
   *
   * @returns date in UTC
   */
  public static createUTCDateNow(): UTCDate {
    return new UTCDate();
  }

  /**
   * Constructs a new `UTCDate` instance.
   *
   * @param date date string | unix timestamp | Date object can be used
   * @returns date in UTC
   */
  public static createUTCDate(date: string | Date | number): UTCDate {
    if (typeof date === 'string') {
      return new UTCDate(date);
    }
    if (typeof date === 'number') {
      return new UTCDate(date);
    }
    return new UTCDate(date);
  }

  /**
   * Converts TZDate to UTCDate
   *
   * @param date TZDate
   * @returns date in UTC
   */
  public static convertLocalDateToUTC(date: TZDate): UTCDate {
    return new UTCDate(transpose(date, tz('UTC')));
    // return new UTCDate(date);
  }
}
