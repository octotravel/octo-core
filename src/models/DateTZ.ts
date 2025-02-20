import { TZDate, tz } from '@date-fns/tz';
import { UTCDate } from '@date-fns/utc';
import { format, parseISO, transpose } from 'date-fns';

export class DateTZ {
  private readonly INTERNAL_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
  private readonly TIME_ZONE_UTC = 'UTC';
  private _internalDate: TZDate | UTCDate;
  private _timeZone: string | undefined;

  public constructor();
  public constructor(string: string, timeZone?: string);
  public constructor(date: Date, timeZone?: string);
  public constructor(timestamp: number, timeZone?: string);
  public constructor(year: number, month: number, timeZone?: string);
  public constructor(year: number, month: number, date: number, timeZone?: string);
  public constructor(year: number, month: number, date: number, hours: number, timeZone?: string);
  public constructor(year: number, month: number, date: number, hours: number, minutes: number, timeZone?: string);
  public constructor(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    timeZone?: string,
  );
  public constructor(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
    timeZone?: string,
  );
  public constructor(...args: any[]) {
    if (args.length > 1 && typeof args[args.length - 1] === 'string') {
      this._timeZone = args.pop();
    }

    if (!args.length) {
      this._internalDate = new TZDate();
    } else if (args.length === 1) {
      const [date] = args;
      if (typeof date === 'string') {
        if (this._timeZone) {
          this._internalDate = parseISO(date, { in: tz(this._timeZone) });
        } else {
          this._internalDate = parseISO(date);
        }
      } else {
        if (this._timeZone) {
          this._internalDate = parseISO(format(date, this.INTERNAL_DATE_FORMAT), { in: tz(this._timeZone) });
        } else {
          this._internalDate = parseISO(format(date, this.INTERNAL_DATE_FORMAT));
        }
      }
    } else if (args.length === 2) {
      const [year, month] = args;
      this._internalDate = new TZDate(year, month, this._timeZone);
    } else if (args.length === 3) {
      const [year, month, date] = args;
      this._internalDate = new TZDate(year, month, date, this._timeZone);
    } else if (args.length === 4) {
      const [year, month, date, hours] = args;
      this._internalDate = new TZDate(year, month, date, hours, this._timeZone);
    } else if (args.length === 5) {
      const [year, month, date, hours, minutes] = args;
      this._internalDate = new TZDate(year, month, date, hours, minutes, this._timeZone);
    } else if (args.length === 6) {
      const [year, month, date, hours, minutes, seconds] = args;
      this._internalDate = new TZDate(year, month, date, hours, minutes, seconds, this._timeZone);
    } else {
      const [year, month, date, hours, minutes, seconds, miliseconds] = args;
      this._internalDate = new TZDate(year, month, date, hours, minutes, seconds, miliseconds, this._timeZone);
    }
  }

  public static tz(tz: string) {
    return new DateTZ(Date.now(), tz);
  }

  public get internalDate() {
    return this._internalDate;
  }

  public get timeZone(): string | null {
    return this._timeZone ?? null;
  }

  public format(formatStr: string): string {
    return format(this._internalDate, formatStr);
  }

  public toUTC() {
    this._internalDate = new UTCDate(this._internalDate);
    this._timeZone = this.TIME_ZONE_UTC;
    return this;
  }

  public toISOString() {
    return this._internalDate.toISOString();
  }
}

// export class DateTZ {
//   private _internalDate: TZDate;

//   public constructor(timeZone?: string);
//   public constructor(string: string, timeZone?: string);
//   public constructor(date: Date, timeZone?: string);
//   public constructor(timestamp: number, timeZone?: string);
//   public constructor(year: number, month: number, timeZone?: string);
//   public constructor(year: number, month: number, date: number, timeZone?: string);
//   public constructor(year: number, month: number, date: number, hours: number, timeZone?: string);
//   public constructor(year: number, month: number, date: number, hours: number, minutes: number, timeZone?: string);
//   public constructor(
//     year: number,
//     month: number,
//     date: number,
//     hours: number,
//     minutes: number,
//     seconds: number,
//     timeZone?: string,
//   );
//   public constructor(
//     year: number,
//     month: number,
//     date: number,
//     hours: number,
//     minutes: number,
//     seconds: number,
//     milliseconds: number,
//     timeZone?: string,
//   );
//   public constructor(...args: any[]) {
//     if (args.length === 1) {
//       const [timeZone] = args;
//       this._internalDate = new TZDate(timeZone);
//     } else if (args.length === 2) {
//       const [date, timeZone] = args;
//       this._internalDate = new TZDate(date, timeZone);
//     } else if (args.length === 3) {
//       const [year, month, timeZone] = args;
//       this._internalDate = new TZDate(year, month, timeZone);
//     } else if (args.length === 4) {
//       const [year, month, date, timeZone] = args;
//       this._internalDate = new TZDate(year, month, date, timeZone);
//     } else if (args.length === 5) {
//       const [year, month, date, hours, timeZone] = args;
//       this._internalDate = new TZDate(year, month, date, hours, timeZone);
//     } else if (args.length === 6) {
//       const [year, month, date, hours, minutes, timeZone] = args;
//       this._internalDate = new TZDate(year, month, date, hours, minutes, timeZone);
//     } else if (args.length === 7) {
//       const [year, month, date, hours, minutes, seconds, timeZone] = args;
//       this._internalDate = new TZDate(year, month, date, hours, minutes, seconds, timeZone);
//     } else {
//       const [year, month, date, hours, minutes, seconds, miliseconds, timeZone] = args;
//       this._internalDate = new TZDate(year, month, date, hours, minutes, seconds, miliseconds, timeZone);
//     }
//   }

//   public format(formatStr: string): string {
//     return format(this._internalDate, formatStr)
//   }
// }
