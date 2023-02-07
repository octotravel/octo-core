import { dinero, toSnapshot, Dinero, add, subtract, multiply, toUnit, halfEven, Currency } from "dinero.js";
import * as dineroCurrencies from "@dinero.js/currencies";

const currencies: { [code: string]: Currency<number> } = dineroCurrencies;

export class Money {
  public currency: string;
  private internalCurrency: Currency<number>;
  private internal: Dinero<number>;

  constructor(n: number, currency: string) {
    this.currency = currency;
    this.internalCurrency = this.getCurrency(currency);

    const scale = this.getInitScale();
    const factor = this.internalCurrency.base ** scale;
    const amount = Math.round(n * factor);
    this.internal = dinero({
      amount: amount,
      currency: this.internalCurrency,
      scale,
    });
  }

  private getInitScale = () => {
    const zeroMoney = dinero({ amount: 0, currency: this.internalCurrency });
    return toSnapshot(zeroMoney).scale;
  };

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
    return toUnit(this.internal, {
      digits: this.getPrecision(),
      round: halfEven,
    });
  };

  public add = (money: Money): Money => {
    this.internal = add(this.internal, money.internal);
    return this;
  };

  public substract = (money: Money): Money => {
    this.internal = subtract(this.internal, money.internal);
    return this;
  };

  public percentage = (n: number): Money => {
    this.internal = multiply(this.internal, {
      amount: n,
      scale: this.getPrecision(),
    });
    return this;
  };
}
