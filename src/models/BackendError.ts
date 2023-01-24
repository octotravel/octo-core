import { HttpError, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR } from "./Error";

export const INVALID_PRODUCT_ID = "INVALID_PRODUCT_ID";
export const INVALID_OPTION_ID = "INVALID_OPTION_ID";
export const INVALID_UNIT_ID = "INVALID_UNIT_ID";
export const INVALID_AVAILABILITY_ID = "INVALID_AVAILABILITY_ID";
export const INVALID_BOOKING_UUID = "INVALID_BOOKING_UUID";
export const BAD_REQUEST = "BAD_REQUEST";
export const UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY";
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
export const UNAUTHORIZED = "UNAUTHORIZED";
export const FORBIDDEN = "FORBIDDEN";

const ERROR_MESSAGE_INVALID_PRODUCT_ID = `The productId was missing or invalid'`;
const ERROR_MESSAGE_INVALID_OPTION_ID = `The optionId was missing or invalid'`;
const ERROR_MESSAGE_INVALID_UNIT_ID = `The unitId was missing or invalid`;
const ERROR_MESSAGE_INVALID_AVAILABILITY_ID = `The availabilityId was missing or invalid`;
const ERROR_MESSAGE_INVALID_BOOKING_UUID = `The uuid was already used, missing or invalid`;
const ERROR_MESSAGE_BAD_REQUEST = `The request body is not formatted correctly, you have missing required fields or any of the data types are incorrect`;
const ERROR_MESSAGE_UNPROCESSABLE_ENTITY = `The request body is technically correct but cannot be processed for other reasons. e.g. you tried to cancel a booking after the cancellation cutoff had elapsed`;
const ERROR_MESSAGE_INTERNAL_SERVER_ERROR = `There was an un-recoverable error, please try again`;
const ERROR_MESSAGE_UNAUTHORIZED = `You didn't send the API Key in the Authorization header to an endpoint that requires authentication`;
const ERROR_MESSAGE_FORBIDDEN = `You sent an API Key that was invalid or has been revoked by the backend system. Or you're trying to access an endpoint/resource that you do not have access to`;

export class OctoError extends HttpError {}

export class OctoInvalidProductIdError extends OctoError {
  public productId: string;
  constructor(productId: string, message?: string) {
    const body = {
      error: INVALID_PRODUCT_ID,
      errorMessage: message ?? ERROR_MESSAGE_INVALID_PRODUCT_ID,
      productId,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
    this.productId = productId;
  }
}

export class OctoInvalidOptionIdError extends OctoError {
  public optionId: string;
  constructor(optionId: string, message?: string) {
    const body = {
      error: INVALID_OPTION_ID,
      errorMessage: message ?? ERROR_MESSAGE_INVALID_OPTION_ID,
      optionId,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
    this.optionId = optionId;
  }
}

export class OctoInvalidUnitIdError extends OctoError {
  public unitId: string;
  constructor(unitId: string, message?: string) {
    const body = {
      error: INVALID_UNIT_ID,
      errorMessage: message ?? ERROR_MESSAGE_INVALID_UNIT_ID,
      unitId,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
    this.unitId = unitId;
  }
}

export class OctoInvalidAvailabilityIdError extends OctoError {
  public availabilityId: string;
  constructor(availabilityId: string, message?: string) {
    const body = {
      error: INVALID_AVAILABILITY_ID,
      errorMessage: message ?? ERROR_MESSAGE_INVALID_AVAILABILITY_ID,
      availabilityId,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
    this.availabilityId = availabilityId;
  }
}

export class OctoInvalidBookingUUIDError extends OctoError {
  public uuid: string;
  constructor(uuid: string, message?: string) {
    const body = {
      error: INVALID_BOOKING_UUID,
      errorMessage: message ?? ERROR_MESSAGE_INVALID_BOOKING_UUID,
      uuid,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
    this.uuid = uuid;
  }
}

export class OctoBadRequestError extends OctoError {
  constructor(errorMessage: string) {
    const body = {
      error: BAD_REQUEST,
      errorMessage: errorMessage ?? ERROR_MESSAGE_BAD_REQUEST,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
  }
}

export class OctoUnprocessableEntityError extends OctoError {
  constructor(message?: string) {
    const body = {
      error: UNPROCESSABLE_ENTITY,
      errorMessage: message ?? ERROR_MESSAGE_UNPROCESSABLE_ENTITY,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
  }
}

export class OctoInternalServerError extends OctoError {
  constructor(message?: string) {
    const body = {
      error: INTERNAL_SERVER_ERROR,
      errorMessage: message ?? ERROR_MESSAGE_INTERNAL_SERVER_ERROR,
    };
    super(STATUS_INTERNAL_SERVER_ERROR, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
  }
}

export class OctoUnauthorizedError extends OctoError {
  constructor(message?: string) {
    const body = {
      error: UNAUTHORIZED,
      errorMessage: message ?? ERROR_MESSAGE_UNAUTHORIZED,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
  }
}

export class OctoForbiddenError extends OctoError {
  constructor(message?: string) {
    const body = {
      error: FORBIDDEN,
      errorMessage: message ?? ERROR_MESSAGE_FORBIDDEN,
    };
    super(STATUS_BAD_REQUEST, {
      body: body,
      error: body.error,
      message: body.errorMessage,
    });
  }
}
