import { Money } from './../Money';
import { describe, expect, it } from 'vitest';

describe('Money', () => {
  describe('init', () => {
    it('should init with invalid currency', async () => {
      expect(() => new Money(1000, 'EURO')).toThrowError();
    });
  });

  describe('getAmount', () => {
    it('should get amount', async () => {
      expect(new Money(1000, 'EUR').getAmount()).toBe(1000);
    });
  });
  describe('getValue', () => {
    it('should get value', async () => {
      expect(new Money(1000, 'EUR').getValue()).toBe(10);
    });
  });
  describe('getPrecision', () => {
    it('should get precision', async () => {
      expect(new Money(1000, 'EUR').getPrecision()).toBe(2);
    });
  });
  describe('add', () => {
    it('should add two mnoney', async () => {
      expect(new Money(1000, 'EUR').add(new Money(1000, 'EUR')).getAmount()).toBe(2000);
    });
  });
  describe('add', () => {
    it('should substract two mnoney', async () => {
      expect(new Money(1000, 'EUR').substract(new Money(500, 'EUR')).getAmount()).toBe(500);
    });
  });
});
