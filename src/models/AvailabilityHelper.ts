import { Availability } from "@octocloud/types";
import { NoAvailabilityError } from "./Error";

export class AvailabilityHelper {
  public static checkAvailability = (availabilities: Array<Availability>, dateString: string): Availability => {
    const availability = availabilities.find((availability) => availability.localDateTimeStart === dateString) ?? null;
    if (availability === null) {
      throw new NoAvailabilityError();
    }
    if (!availability.available) {
      throw new NoAvailabilityError();
    }
    return availability;
  };
}
