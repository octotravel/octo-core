import { Availability } from '@octocloud/types';
import { DateHelper } from './DateHelper';
import { NoAvailabilityError } from './Error';

export class AvailabilityHelper {
  public static checkAvailability = (availabilities: Availability[], dateString: string): Availability => {
    const availability =
      availabilities.find((availability) => {
        if (availability.allDay) {
          return DateHelper.getDate(availability.localDateTimeStart) === DateHelper.getDate(dateString);
        }
        return availability.localDateTimeStart === dateString;
      }) ?? null;
    if (availability === null) {
      throw new NoAvailabilityError();
    }
    if (!availability.available) {
      throw new NoAvailabilityError();
    }
    return availability;
  };
}
