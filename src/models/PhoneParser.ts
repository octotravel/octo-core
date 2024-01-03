import parsePhoneNumber, { AsYouType, PhoneNumber } from "libphonenumber-js";

interface ParsedPhoneNumber {
  international: string;
  national: string;
  valid: boolean;
  country: string | null;
}

export class PhoneParser {
  public parse = (phoneNumber: string): ParsedPhoneNumber => {
    try {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

      if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
        // ventrata doesn't support kosovo rn
        if (parsedPhoneNumber.country && parsedPhoneNumber.country === "XK") {
          return this.mapPhoneNumber(phoneNumber);
        }

        return this.mapPhoneNumber(phoneNumber, parsedPhoneNumber);
      }

      const number = new AsYouType().input(phoneNumber);
      return this.mapPhoneNumber(number);
    } catch (e) {
      return this.mapPhoneNumber(phoneNumber);
    }
  };

  private mapPhoneNumber = (phoneNumber: string, parsedPhoneNumber?: PhoneNumber): ParsedPhoneNumber => {
    return {
      international: parsedPhoneNumber ? parsedPhoneNumber.formatInternational() : phoneNumber,
      national: parsedPhoneNumber ? parsedPhoneNumber.formatNational() : phoneNumber,
      valid: parsedPhoneNumber ? parsedPhoneNumber.isValid() : false,
      country: parsedPhoneNumber?.country ?? null,
    };
  };
}
