import parsePhoneNumber from "libphonenumber-js";

interface PhoneNumber {
  international: string;
  national: string;
  valid: boolean;
  country?: string;
}

export class PhoneParser {
  public parse = (phoneNumber: string): PhoneNumber => {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

    if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
      // ventrata doesn't support kosovo rn
      if (parsedPhoneNumber.country && parsedPhoneNumber.country === "XK") {
        return {
          international: phoneNumber,
          national: phoneNumber,
          valid: true,
        };
      }

      return {
        international: parsedPhoneNumber.formatInternational(),
        national: parsedPhoneNumber.formatNational(),
        valid: true,
        country: parsedPhoneNumber.country,
      };
    } else {
      return {
        international: phoneNumber,
        national: phoneNumber,
        valid: false,
      };
    }
  };
}
