import { format, toDate } from 'date-fns-tz';
export abstract class DateHelper {
  public static getTime(dateTime: string): string {
    return dateTime.split('T')[1].slice(0, 5);
  }

  public static getDate(dateTime: string): string {
    return dateTime.split('T')[0];
  }

  public static toISOString = (date: Date): string => {
    return `${date.toISOString().split('.')[0]}Z`;
  };

  public static availabilityIdFormat = (date: Date | string, timeZone: string): string => {
    const formatString = "yyyy-MM-dd'T'HH:mm:ssxxx";
    if (typeof date === 'string') {
      return format(toDate(date), formatString, {
        timeZone,
      });
    }
    return format(date, formatString, {
      timeZone,
    });
  };
}
