import { dinero, toSnapshot, Dinero, add, subtract, toDecimal, Currency } from "dinero.js";
import * as dineroCurrencies from "@dinero.js/currencies";

const currencies: { [code: string]: Currency<number> } = dineroCurrencies;

export class Money {
  public currency: string;
  private internalCurrency: Currency<number>;
  private internal: Dinero<number>;

  constructor(n: number, currency: string) {
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
  private getCurrency = (code: string): Currency<number> => {
    const currency = currencies[code];
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

  public add = (money: Money): Money => {
    this.internal = add(this.internal, money.internal);
    return this;
  };

  public substract = (money: Money): Money => {
    this.internal = subtract(this.internal, money.internal);
    return this;
  };
}
