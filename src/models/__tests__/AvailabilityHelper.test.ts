import { AvailabilityModelGenerator, AvailabilityParser } from '@octocloud/generators';
import { AvailabilityHelper } from '../AvailabilityHelper';
import { NoAvailabilityError } from '../Error';
import { Availability } from '@octocloud/types';

describe('AvailabilityHelper', () => {
  const availabilityModelGenerator = new AvailabilityModelGenerator();
  const availabilityParser = new AvailabilityParser();

  const successLocalDateTimeStart = '2023-12-01T00:00:00+01:00';
  const unavailableLocalDateTimeStart = '2023-12-02T00:00:00+01:00';

  const availabilityModels = availabilityModelGenerator.generateMultipleAvailabilities([
    {
      localDateTimeStart: successLocalDateTimeStart,
    },
    {
      localDateTimeStart: unavailableLocalDateTimeStart,
      available: false,
    },
    {
      localDateTimeStart: '2023-12-03T00:00:00+01:00',
      available: true,
    },
  ]);

  const availabilyPOJOs = availabilityModels.map((availabilityModel) => {
    return availabilityParser.parseModelToPOJO(availabilityModel);
  });

  describe('checkAvailability', () => {
    it('should successfully check availability', async () => {
      const availability = AvailabilityHelper.checkAvailability(availabilyPOJOs, successLocalDateTimeStart);
      expect(availability !== null);
    });

    it('should throw NoAvailabilityError due to non existing localDateTimeStart', async () => {
      const checkAvailability = (): Availability => {
        return AvailabilityHelper.checkAvailability(availabilyPOJOs, '2023-12-10T00:00:00+01:00');
      };

      expect(checkAvailability).toThrowError(NoAvailabilityError);
    });

    it('should throw NoAvailabilityError due to unavailability', async () => {
      const checkAvailability = (): Availability => {
        return AvailabilityHelper.checkAvailability(availabilyPOJOs, unavailableLocalDateTimeStart);
      };

      expect(checkAvailability).toThrowError(NoAvailabilityError);
    });
  });
});
