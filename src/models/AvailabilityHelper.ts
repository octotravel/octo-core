import { Availability } from '@octocloud/types';
import { NoAvailabilityError } from './Error';
import { PricingUnitHelper } from './PricingUnitHelper';

export class AvailabilityHelper {
  public static checkAvailability = (availabilities: Availability[], dateString: string): Availability => {
    const availability = availabilities.find((availability) => availability.localDateTimeStart === dateString) ?? null;
    if (availability === null) {
      throw new NoAvailabilityError();
    }
    if (!availability.available) {
      throw new NoAvailabilityError();
    }
    return availability;
  };

  public static updateWithFiltereredFirstUnitPricing(availabilities: Availability[]): Availability[] {
    for (const availability of availabilities) {
      if (!availability.unitPricing || availability.unitPricing.length === 0) {
        continue;
      }

      const filteredUnitPricings = PricingUnitHelper.filterFirstUnitPricing(availability.unitPricing);
      availability.unitPricing = filteredUnitPricings;
    }

    return availabilities;
  }
}
