import { OptionModelGenerator, OptionParser } from '@octocloud/generators';
import { UnitType } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { InvalidUnitError, InvalidUnitsError, OptionRestrictionsError } from '../Error';
import { OptionHelper } from '../OptionHelper';

describe('OptionHelper', () => {
  const optionModelGenerator = new OptionModelGenerator();
  const optionParser = new OptionParser();

  const firstUnitId = 'firstUnitId';
  const secondUnitId = 'secondUnitId';
  const usedUnitType = UnitType.ADULT;
  const invalidUnitId = 'invalidUnitId';
  const unusedUnitType = UnitType.MILITARY;
  const optionModel = optionModelGenerator.generateOption({
    optionData: {
      units: [
        {
          id: firstUnitId,
          type: usedUnitType,
        },
        {
          id: secondUnitId,
          type: usedUnitType,
          restrictions: {
            minAge: 0,
            maxAge: 99,
            idRequired: false,
            minQuantity: 2,
            maxQuantity: 4,
            paxCount: 0,
            accompaniedBy: [firstUnitId],
          },
        },
      ],
    },
  });
  const option = optionParser.parseModelToPOJO(optionModel);
  const optionModelWithoutUnits = optionModelGenerator.generateOption({
    optionData: {
      restrictions: {
        minUnits: 1,
        maxUnits: 2,
        minPaxCount: 0,
        maxPaxCount: null,
      },
    },
  });
  const optionWithoutUnits = optionParser.parseModelToPOJO(optionModelWithoutUnits);

  describe('checkUnits', () => {
    it('should successfully pass check', async () => {
      const checkUnits = (): void => {
        OptionHelper.checkUnits(option, [
          {
            id: firstUnitId,
            quantity: 1,
          },
        ]);
      };

      expect(checkUnits).not.toThrow();
    });

    it('should fail and throw InvalidUnitsError', async () => {
      const checkUnits = (): void => {
        OptionHelper.checkUnits(option, [
          {
            id: invalidUnitId,
            quantity: 1,
          },
        ]);
      };

      expect(checkUnits).toThrowError(InvalidUnitsError);
    });
  });

  describe('getUnitByID', () => {
    it('should successfully return unit', async () => {
      const getUnitByID = (): void => {
        OptionHelper.getUnitByID(option, firstUnitId);
      };

      expect(getUnitByID).not.toThrow();
    });

    it('should fail and throw InvalidUnitError', async () => {
      const getUnitByID = (): void => {
        OptionHelper.getUnitByID(option, invalidUnitId);
      };

      expect(getUnitByID).toThrowError(InvalidUnitError);
    });
  });

  describe('getUnitByType', () => {
    it('should successfully return unit', async () => {
      const getUnitByType = (): void => {
        OptionHelper.getUnitByType(option, usedUnitType);
      };

      expect(getUnitByType).not.toThrow();
    });

    it('should fail and throw InvalidUnitError', async () => {
      const getUnitByType = (): void => {
        OptionHelper.getUnitByType(option, unusedUnitType);
      };

      expect(getUnitByType).toThrowError(InvalidUnitError);
    });
  });

  describe('checkRestrictions', () => {
    it('should successfully pass check', async () => {
      const checkRestrictions = (): void => {
        OptionHelper.checkRestrictions(option, [
          {
            id: firstUnitId,
            quantity: 1,
          },
        ]);
      };

      expect(checkRestrictions).not.toThrow();
    });

    it('should successfully pass check when one unit has to be accompanied', async () => {
      const checkRestrictions = (): void => {
        OptionHelper.checkRestrictions(option, [
          {
            id: firstUnitId,
            quantity: 1,
          },
          {
            id: secondUnitId,
            quantity: 2,
          },
        ]);
      };

      expect(checkRestrictions).not.toThrow();
    });

    it('should fail check when one unit has to be accompanied and it is not', async () => {
      const checkRestrictions = (): void => {
        OptionHelper.checkRestrictions(option, [
          {
            id: secondUnitId,
            quantity: 1,
          },
        ]);
      };

      expect(checkRestrictions).toThrowError(OptionRestrictionsError);
    });

    it('should fail when invalid unit is provided', async () => {
      const checkRestrictions = (): void => {
        OptionHelper.checkRestrictions(option, [
          {
            id: invalidUnitId,
            quantity: 1,
          },
        ]);
      };

      expect(checkRestrictions).toThrowError(InvalidUnitError);
    });

    it('should fail on unit`s restrictions and throw OptionRestrictionsError', async () => {
      const checkRestrictionsIsMinOk = (): void => {
        OptionHelper.checkRestrictions(option, [
          {
            id: secondUnitId,
            quantity: 1,
          },
        ]);
      };

      const checkRestrictionsIsMaxOk = (): void => {
        OptionHelper.checkRestrictions(option, [
          {
            id: secondUnitId,
            quantity: 5,
          },
        ]);
      };

      expect(checkRestrictionsIsMinOk).toThrowError(OptionRestrictionsError);
      expect(checkRestrictionsIsMaxOk).toThrowError(OptionRestrictionsError);
    });

    it('should fail on option`s restrictions and throw OptionRestrictionsError', async () => {
      const checkRestrictions = (): void => {
        OptionHelper.checkRestrictions(optionWithoutUnits, []);
      };

      expect(checkRestrictions).toThrowError(OptionRestrictionsError);
    });
  });
});
