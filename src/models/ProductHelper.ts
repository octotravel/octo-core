import { Option, Product, Unit, UnitType } from "@octocloud/types";
import { OptionHelper } from "./OptionHelper";
import { InvalidOptionError } from "./Error";

export class ProductHelper {
  /**
   * @throws {InvalidOptionError}
   */
  public static findOption = (optionId: string, product: Product): Option => {
    const option = product.options.find((option) => option.id === optionId) ?? null;
    if (option === null) {
      throw new InvalidOptionError(optionId, product.id);
    }
    return option;
  };

  /**
   * @throws {InvalidOptionError}
   * @throws {InvalidUnitError}
   */
  public static getUnitById = (optionId: string, unitId: string, product: Product): Unit => {
    const option = this.findOption(optionId, product);
    return OptionHelper.getUnitByID(option, unitId);
  };

  /**
   * @throws {InvalidOptionError}
   * @throws {InvalidUnitError}
   */
  public static getUnitByType = (optionId: string, unitType: UnitType, product: Product): Unit => {
    const option = this.findOption(optionId, product);
    return OptionHelper.getUnitByType(option, unitType);
  };
}
