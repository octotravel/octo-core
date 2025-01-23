import { describe, expect, it } from 'vitest';
import { PhoneParser } from '../PhoneParser';

describe('PhoneParser', () => {
  const parser = new PhoneParser();
  const numbers = [
    '+1 202-555-0181', // (United States)
    '+44 20 7946 0857', // (United Kingdom)
    '+61 2 9876 5432', // (Australia)
    '+91 98765 43210', // (India)
    '+27 21 555 0192', // (South Africa)
    '+55 21 99999-8888', // (Brazil)
    '+81 3-1234-5678', // (Japan)
    '+49 30 1234567', // (Germany)
    '+33 1 23 45 67 89', // (France)
    '+7 495 123-45-67', // (Russia)
  ];
  describe('parse', () => {
    it('should parse phone number', async () => {
      const expected = {
        international: '+1 202 555 0181',
        national: '(202) 555-0181',
        valid: true,
        country: 'US',
      };
      expect(parser.parse('+1 202-555-0181')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '+44 20 7946 0857',
        national: '020 7946 0857',
        valid: true,
        country: 'GB',
      };
      expect(parser.parse('+44 20 7946 0857')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '+61 2 9876 5432',
        national: '(02) 9876 5432',
        valid: true,
        country: 'AU',
      };
      expect(parser.parse('+61 2 9876 5432')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '+91 98765 43210',
        national: '098765 43210',
        valid: true,
        country: 'IN',
      };
      expect(parser.parse('+91 98765 43210')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '+27 21 555 0192',
        national: '021 555 0192',
        valid: true,
        country: 'ZA',
      };
      expect(parser.parse('+27 21 555 0192')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '+55 21 99999 8888',
        national: '(21) 99999-8888',
        valid: true,
        country: 'BR',
      };
      expect(parser.parse('+55 21 99999-8888')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '+81 3 1234 5678',
        national: '03-1234-5678',
        valid: true,
        country: 'JP',
      };
      expect(parser.parse('+81 3-1234-5678')).toEqual(expected);
    });

    it('should parse phone number', async () => {
      const expected = {
        international: '4084769420',
        national: '4084769420',
        valid: false,
        country: null,
      };
      expect(parser.parse('(408) 476-9420')).toEqual(expected);
    });
  });
});
