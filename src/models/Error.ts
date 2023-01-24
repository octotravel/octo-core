export const STATUS_SUCCESS = 200;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_UNAUTHORIZED = 401;
export const STATUS_FORBIDDEN = 403;
export const STATUS_NOT_FOUD = 404;
export const STATUS_INTERNAL_SERVER_ERROR = 500;
export const MESSAGE_BAD_REQUEST = "Bad Request";
export const MESSAGE_NOT_FOUND = "Not Found";
export const MESSAGE_UNAUTHORIZED = "Unauthorized";
export const MESSAGE_INTERNAL_SERVER_ERROR = "Internal Server Error";

export const MESSAGE_NO_AVAILABILITY_ERROR = "No Availability";
export const MESSAGE_OPTION_RESTRICTIONS_ERROR = "Option Restrictions aren't met";
export const MESSAGE_INVALID_UNITS_ERROR = "Invalid Units";
export const MESSAGE_INVALID_UNIT_ERROR = "Invalid Unit";
export const MESSAGE_EXTERNAL_API_ERROR = "External Api Error";
export const MESSAGE_INVALID_PRODUCT_ID = "Invalid Product ID";

export interface BaseError {
  status: number;
  message: string;
  error: string;
}

export const isBaseError = (err: Record<string, any>): err is BaseError => {
  return Boolean(err?.status && err?.message && err?.error);
};

export class InternalError extends Error implements BaseError {
  public message: string;
  public error = MESSAGE_INTERNAL_SERVER_ERROR;
  public status = STATUS_INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class NoAvailabilityError extends InternalError {
  constructor() {
    super(MESSAGE_NO_AVAILABILITY_ERROR);
  }
}
export class OptionRestrictionsError extends InternalError {
  public minUnits: number;
  public maxUnits: number | null;

  constructor(minUnits: number, maxUnits: number | null) {
    super(MESSAGE_OPTION_RESTRICTIONS_ERROR);
    this.minUnits = minUnits;
    this.maxUnits = maxUnits;
  }
}

export class ExternalApiError extends InternalError {
  public httpError: HttpError;
  constructor(error: HttpError) {
    super(MESSAGE_EXTERNAL_API_ERROR);
    this.httpError = error;
  }
}
export class InvalidUnitsError extends InternalError {
  public invalidUnits: Array<string>;
  constructor(invalidUnits: Array<string>) {
    super(MESSAGE_INVALID_UNITS_ERROR);
    this.invalidUnits = invalidUnits;
  }
}
export class InvalidUnitError extends InternalError {
  public unit: string;
  constructor(unit: string) {
    super(MESSAGE_INVALID_UNITS_ERROR);
    this.unit = unit;
  }
}

export class InvalidProductId extends InternalError {
  public productId: string;
  public optionId: string;
  constructor(productId: string, optionId: string) {
    super(MESSAGE_INVALID_PRODUCT_ID);
    this.productId = productId;
    this.optionId = optionId;
  }
}

export type HttpErrorParams = {
  message?: string;
  error?: string;
  body?: Record<string, any>;
  requestId?: string | null;
  subRequestId?: string | null;
  statusLog?: number;
};
export class HttpError extends Error implements BaseError {
  public status: number;
  public statusLog: number;
  public error: string;
  public body: Record<string, any> = {};
  public requestId: string | null;
  public subRequestId: string | null;
  public errorParams: HttpErrorParams;

  constructor(
    status: number,
    { message = "", body, error = "", requestId = null, subRequestId = null, statusLog }: HttpErrorParams
  ) {
    super();
    const errorParams = {
      message,
      body,
      error,
      requestId,
      subRequestId,
      statusLog,
    };
    this.name = message;
    this.message = message;
    this.status = status;
    this.statusLog = statusLog ?? status;
    this.error = error;
    this.requestId = requestId;
    this.subRequestId = subRequestId;
    this.body = { ...body };
    this.errorParams = errorParams;
  }
}

export class HttpBadRequest extends HttpError {
  constructor(body: Record<string, unknown>) {
    super(STATUS_BAD_REQUEST, {
      message: MESSAGE_BAD_REQUEST,
      body,
    });
  }
}

export class HttpNotFound extends HttpError {
  constructor(body: Record<string, unknown>) {
    super(STATUS_NOT_FOUD, {
      message: MESSAGE_NOT_FOUND,
      body,
    });
  }
}

export class HttpUnauthorized extends HttpError {
  constructor(body?: Record<string, unknown>) {
    super(STATUS_UNAUTHORIZED, {
      message: MESSAGE_UNAUTHORIZED,
      body,
    });
  }
}
export class HttpInternalServerError extends HttpError {
  constructor(body?: Record<string, unknown>) {
    super(STATUS_INTERNAL_SERVER_ERROR, {
      message: MESSAGE_INTERNAL_SERVER_ERROR,
      body,
    });
  }
}

export class ConnectionNotFound extends HttpNotFound {
  constructor(id: string) {
    const body = { error: `Connection:${id} not found` };
    super(body);
  }
}

export class AccountNotFound extends HttpNotFound {
  constructor(id: string) {
    const body = { error: `Account:${id} not found` };
    super(body);
  }
}

export class ConnectionUnauthorized extends HttpUnauthorized {
  constructor(connectionId: string, accountId: string) {
    const body = {
      error: `Connection:${connectionId} doesn't belong to Account:${accountId}`,
    };
    super(body);
  }
}

export class ChannelNotConnected extends HttpUnauthorized {
  constructor(id: string) {
    const body = { error: `Channel with connectionId:${id} not connected` };
    super(body);
  }
}
export class ChannelNotFound extends HttpUnauthorized {
  constructor(name: string) {
    const body = {
      error: `Channel with name: ${name.toUpperCase()} not found`,
    };
    super(body);
  }
}
