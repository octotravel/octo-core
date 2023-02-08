import { ProductModelGenerator, ProductParser } from "@octocloud/generators";
import { ProductHelper } from "../ProductHelper";
import { InvalidOptionError, InvalidUnitError } from "../Error";
import { UnitType } from "@octocloud/types";

describe("ProductHelper", () => {
  const productModelGenerator = new ProductModelGenerator();
  const productParser = new ProductParser();

  const optionId = "optionId";
  const invalidOptionId = "invalidOptionId";
  const unitId = "unitId";
  const invalidUnitId = "invalidUnitId";
  const usedUnitType = UnitType.ADULT;
  const unusedUnitType = UnitType.MILITARY;

  const productModel = productModelGenerator.generateProduct({
    productData: {
      options: [
        {
          id: optionId,
          units: [
            {
              id: unitId,
              type: usedUnitType,
            },
          ],
        },
      ],
    },
  });
  const product = productParser.parseModelToPOJO(productModel);

  describe("findOption", () => {
    it("should return option", async () => {
      const option = ProductHelper.findOption(optionId, product);
      expect(option !== null);
    });

    it("should fail and throw InvalidOptionError", async () => {
      const findOption = () => {
        ProductHelper.findOption(invalidOptionId, product);
      };

      expect(findOption).toThrowError(InvalidOptionError);
    });
  });

  describe("getUnitById", () => {
    it("should return unit", async () => {
      const unit = ProductHelper.getUnitById(optionId, unitId, product);
      expect(unit !== null);
    });

    it("should fail and throw InvalidUnitError", async () => {
      const getUnitById = () => {
        ProductHelper.getUnitById(optionId, invalidUnitId, product);
      };

      expect(getUnitById).toThrowError(InvalidUnitError);
    });
  });

  describe("getUnitByType", () => {
    it("should return unit", async () => {
      const unit = ProductHelper.getUnitByType(optionId, usedUnitType, product);
      expect(unit !== null);
    });

    it("should fail and throw InvalidUnitError", async () => {
      const getUnitById = () => {
        ProductHelper.getUnitByType(optionId, unusedUnitType, product);
      };

      expect(getUnitById).toThrowError(InvalidUnitError);
    });
  });
});
