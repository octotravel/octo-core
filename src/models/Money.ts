import * as dineroCurrencies from '@dinero.js/currencies';
import { Currency, Dinero, add, dinero, subtract, toDecimal, toSnapshot } from 'dinero.js';

const currencies: Record<string, Currency<number>> = dineroCurrencies;

export class Money {
  public currency: string;
  private readonly internalCurrency: Currency<number>;
  private internal: Dinero<number>;

  public constructor(n: number, currency: string) {
    this.currency = currency;
    this.internalCurrency = this.getCurrency(currency);
    this.internal = dinero({
      amount: n,
      currency: this.internalCurrency,
    });
  }

  /**
   * @throws {Error}
   */
  private readonly getCurrency = (code: string): Currency<number> => {
    const currency = currencies[code.toUpperCase()];
    if (currency) {
      return currency;
    }
    throw new Error(`currency not supported: ${code}`);
  };

  public getPrecision = (): number => {
    return toSnapshot(this.internal).scale;
  };

  public getAmount = (): number => {
    return toSnapshot(this.internal).amount;
  };

  public getValue = (): number => {
    return Number(toDecimal(this.internal));
  };

  public add = (money: Money): this => {
    this.internal = add(this.internal, money.internal);
    return this;
  };

  public substract = (money: Money): this => {
    this.internal = subtract(this.internal, money.internal);
    return this;
  };
}
