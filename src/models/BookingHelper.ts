import { Booking, UnitItem, UnitType } from "@octocloud/types";
import { InvalidUnitError } from "./Error";

export class BookingHelper {
  public static getUnitItemByType = (unitType: UnitType, booking: Booking): UnitItem => {
    const unitItem = booking.unitItems.find((item) => item.unit.type === unitType) ?? null;
    if (unitItem === null) {
      throw new InvalidUnitError(unitType);
    }
    return unitItem;
  };
}
