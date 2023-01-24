describe("OptionHelper", () => {
    const optionModelGenerator = new OptionModelGenerator();
    const optionParser = new OptionParser();
  
    const firstUnitId = "firstUnitId";
    const secondUnitId = "secondUnitId";
    const usedUnitType = UnitType.ADULT;
    const invalidUnitId = "invalidUnitId";
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
              accompaniedBy: [],
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
        },
      },
    });
    const optionWithoutUnits = optionParser.parseModelToPOJO(optionModelWithoutUnits);
  
    describe("checkUnits", () => {
      it("should successfully pass check", async () => {
      }
      );