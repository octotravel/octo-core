import { addSeconds, subSeconds } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';
import { DateFactory } from '../DateFactory';
import { HeaderParser } from '../HeaderParser';

describe('HeaderParser.getRetryAfterInSeconds', () => {
  it('should return 0 if response is null or undefined', () => {
    expect(HeaderParser.getRetryAfterInSeconds(null as any)).toBe(0);
    expect(HeaderParser.getRetryAfterInSeconds(undefined as any)).toBe(0);
  });

  it('should return 0 if response.headers is null or undefined', () => {
    const response = { headers: null } as any;
    expect(HeaderParser.getRetryAfterInSeconds(response)).toBe(0);
  });

  it('should return 0 if the "retry-after" header is not present', () => {
    const response = {
      headers: {
        get: vi.fn().mockReturnValue(null),
      },
    } as unknown as Response;

    expect(HeaderParser.getRetryAfterInSeconds(response)).toBe(0);
    expect(response.headers.get).toHaveBeenCalledWith('retry-after');
  });

  it('should return the numeric value if "retry-after" header is a valid number', () => {
    const response = {
      headers: {
        get: vi.fn().mockReturnValue('10'),
      },
    } as unknown as Response;

    expect(HeaderParser.getRetryAfterInSeconds(response)).toBe(10);
    expect(response.headers.get).toHaveBeenCalledWith('retry-after');
  });

  it('should return 1 if "retry-after" header is 0 or NaN when parsed as a number', () => {
    const responseWithZero = {
      headers: {
        get: vi.fn().mockReturnValue('0'),
      },
    } as unknown as Response;

    const responseWithNaN = {
      headers: {
        get: vi.fn().mockReturnValue('not-a-number'),
      },
    } as unknown as Response;

    expect(HeaderParser.getRetryAfterInSeconds(responseWithZero)).toBe(1);
    expect(HeaderParser.getRetryAfterInSeconds(responseWithNaN)).toBe(0);
  });

  it('should return the difference in seconds if "retry-after" is a valid date string in the future', () => {
    const futureDate = addSeconds(DateFactory.createUTCDateNow(), 5).toUTCString(); // 5 seconds in the future
    const response = {
      headers: {
        get: vi.fn().mockReturnValue(futureDate),
      },
    } as unknown as Response;

    expect(HeaderParser.getRetryAfterInSeconds(response)).toBeGreaterThanOrEqual(4);
    expect(HeaderParser.getRetryAfterInSeconds(response)).toBeLessThanOrEqual(5);
  });

  it('should return 1 if "retry-after" is a valid date string in the past', () => {
    const pastDate = subSeconds(DateFactory.createUTCDateNow(), 5).toUTCString(); // 5 seconds in the past
    const response = {
      headers: {
        get: vi.fn().mockReturnValue(pastDate),
      },
    } as unknown as Response;

    expect(HeaderParser.getRetryAfterInSeconds(response)).toBe(1);
  });

  it('should return 0 if "retry-after" is an invalid date string', () => {
    const invalidDate = 'invalid-date';
    const response = {
      headers: {
        get: vi.fn().mockReturnValue(invalidDate),
      },
    } as unknown as Response;

    expect(HeaderParser.getRetryAfterInSeconds(response)).toBe(0);
  });
});
