import { BookingModelGenerator, BookingParser } from "@octocloud/generators";
import { UnitType } from "@octocloud/types";
import { BookingHelper } from "../BookingHelper";
import { InvalidUnitError } from "../Error";

describe("BookingHelper", () => {
  const bookingModelGenerator = new BookingModelGenerator();
  const bookingParser = new BookingParser();
  const bookingModel = bookingModelGenerator.generateBooking({
    bookingData: {
      availability: {
        id: "2023-01-03T09:15:00+01:00",
        localDateTimeStart: "2023-01-03T09:15:00+01:00",
        localDateTimeEnd: "2023-01-03T09:39:00+01:00",
        allDay: false,
        openingHours: [],
      },
    },
  });
  const booking = bookingParser.parseModelToPOJO(bookingModel);

  describe("getUnitItemByType", () => {
    it("should return unit item", async () => {
      const unitItem = BookingHelper.getUnitItemByType(UnitType.ADULT, booking);
      expect(unitItem !== null);
    });

    it("should throw InvalidUnitError due to non existing unit item", async () => {
      const getUnitItemByType = () => {
        BookingHelper.getUnitItemByType(UnitType.MILITARY, booking);
      };

      expect(getUnitItemByType).toThrowError(InvalidUnitError);
    });
  });
});
