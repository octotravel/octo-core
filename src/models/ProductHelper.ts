import { Option, Product, Unit, UnitType } from "@octocloud/types";
import { OptionHelper } from "./OptionHelper";
import { InvalidProductId } from "./Error";

export class ProductHelper {
  public static findOption = (optionId: string, product: Product): Option => {
    const option = product.options.find((option) => option.id === optionId) ??
      null;
    if (option === null) {
      throw new InvalidProductId(product.id, optionId);
    }
    return option;
  };

  public static getUnitById = (
    optionId: string,
    unitId: string,
    product: Product,
  ): Unit => {
    const option = this.findOption(optionId, product);
    return OptionHelper.getUnitByID(unitId, option);
  };

  public static getUnitByType = (
    optionId: string,
    unitType: UnitType,
    product: Product,
  ): Unit => {
    const option = this.findOption(optionId, product);
    return OptionHelper.getUnitByType(unitType, option);
  };
}
