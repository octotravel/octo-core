export class FinanceHelper {
  public bankersRounding(value: number, decimalPlaces?: number): number {
    const m = 10 ** (decimalPlaces || 0);
    const n = +(decimalPlaces ? value * m : value).toFixed(8);
    const i = Math.floor(n);
    const f = n - i;
    const e = 1e-8;
    const r = f > 0.5 - e && f < 0.5 + e ? (i % 2 === 0 ? i : i + 1) : Math.round(n);
    return decimalPlaces ? r / m : r;
  }
}
