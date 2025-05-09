import { Unit } from '@octocloud/types';

export const STATUS_SUCCESS = 200;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_UNAUTHORIZED = 401;
export const STATUS_FORBIDDEN = 403;
export const STATUS_NOT_FOUD = 404;
export const STATUS_CLIENT_CLOSED_REQUEST = 499;
export const STATUS_INTERNAL_SERVER_ERROR = 500;
export const STATUS_SERVICE_UNAVAILABLE_ERROR = 503;
export const STATUS_GATEWAY_TIMEOUT = 504;

export const MESSAGE_BAD_REQUEST = 'Bad Request';
export const MESSAGE_NOT_FOUND = 'Not Found';
export const MESSAGE_CLIENT_CLOSED_REQUEST = 'Client Closed Request';
export const MESSAGE_UNAUTHORIZED = 'Unauthorized';
export const MESSAGE_FORBIDDEN = 'Forbidden';
export const MESSAGE_INTERNAL_SERVER_ERROR = 'Internal Server Error';
export const MESSAGE_SERVICE_UNAVAILABLE_ERROR = 'Service Unavailable Error';
export const MESSAGE_GATEWAY_TIMEOUT = 'Gateway Timeout Error';

export const MESSAGE_NO_AVAILABILITY_ERROR = 'No Availability';
export const MESSAGE_OPTION_RESTRICTIONS_ERROR = "Option Restrictions aren't met";
export const MESSAGE_INVALID_UNITS_ERROR = 'Invalid Units';
export const MESSAGE_INVALID_UNIT_ERROR = 'Invalid Unit';
export const MESSAGE_EXTERNAL_API_ERROR = 'External Api Error';
export const MESSAGE_INVALID_PRODUCT_ID = 'Invalid Product ID';

export interface BaseError {
  status: number;
  message: string;
  error: string;
}

export class RuntimeError extends Error {}

export class LogicError extends Error {}

export const isBaseError = (err: Record<string, any>): err is BaseError => {
  return Boolean(err?.status && err?.message && err?.error);
};

export class InternalError extends Error implements BaseError {
  public readonly message: string;
  public readonly error = MESSAGE_INTERNAL_SERVER_ERROR;
  public readonly status = STATUS_INTERNAL_SERVER_ERROR;

  public constructor(message: string) {
    super();
    this.message = message;
  }
}

export class NoAvailabilityError extends InternalError {
  public constructor() {
    super(MESSAGE_NO_AVAILABILITY_ERROR);
  }
}
export class OptionRestrictionsError extends InternalError {
  public readonly minUnits: number;
  public readonly maxUnits: number | null;
  public readonly unit: Unit | null;
  public readonly isAccompaniedByOk: boolean;

  public constructor({
    minUnits,
    maxUnits,
    unit,
    isAccompaniedByOk = true,
  }: {
    minUnits: number;
    maxUnits: number | null;
    unit?: Unit;
    isAccompaniedByOk?: boolean;
  }) {
    super(MESSAGE_OPTION_RESTRICTIONS_ERROR);
    this.minUnits = minUnits;
    this.maxUnits = maxUnits;
    this.unit = unit ?? null;
    this.isAccompaniedByOk = isAccompaniedByOk;
  }
}

export class ExternalApiError extends InternalError {
  public readonly httpError: HttpError;
  public constructor(error: HttpError) {
    super(MESSAGE_EXTERNAL_API_ERROR);
    this.httpError = error;
  }
}
export class InvalidUnitsError extends InternalError {
  public readonly invalidUnits: string[];
  public constructor(invalidUnits: string[]) {
    super(MESSAGE_INVALID_UNITS_ERROR);
    this.invalidUnits = invalidUnits;
  }
}
export class InvalidUnitError extends InternalError {
  public readonly unit: string;
  public constructor(unit: string) {
    super(MESSAGE_INVALID_UNITS_ERROR);
    this.unit = unit;
  }
}

export class InvalidOptionError extends InternalError {
  public readonly optionId: string;
  public readonly productId: string;
  public constructor(optionId: string, productId: string) {
    super(MESSAGE_INVALID_PRODUCT_ID);
    this.optionId = optionId;
    this.productId = productId;
  }
}

export interface HttpErrorParams {
  message?: string;
  error?: string;
  body?: Record<string, any>;
  requestId?: string | null;
  subRequestId?: string | null;
  statusLog?: number;
}
export class HttpError extends Error implements BaseError {
  public readonly status: number;
  public readonly statusLog: number;
  public readonly error: string;
  public readonly body: Record<string, any> = {};
  public readonly requestId: string | null;
  public readonly subRequestId: string | null;
  public readonly errorParams: HttpErrorParams;

  public constructor(
    status: number,
    { message = '', body, error = '', requestId = null, subRequestId = null, statusLog }: HttpErrorParams,
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
  public constructor(body: Record<string, any>) {
    super(STATUS_BAD_REQUEST, {
      message: MESSAGE_BAD_REQUEST,
      body,
    });
  }
}

export class HttpNotFound extends HttpError {
  public constructor(body: Record<string, any>) {
    super(STATUS_NOT_FOUD, {
      message: MESSAGE_NOT_FOUND,
      body,
    });
  }
}

export class HttpClientClosedRequestError extends HttpError {
  public constructor(body?: Record<string, any>) {
    super(STATUS_CLIENT_CLOSED_REQUEST, {
      message: MESSAGE_CLIENT_CLOSED_REQUEST,
      body,
    });
  }
}

export class HttpUnauthorized extends HttpError {
  public constructor(body?: Record<string, any>) {
    super(STATUS_UNAUTHORIZED, {
      message: MESSAGE_UNAUTHORIZED,
      body,
    });
  }
}

export class HttpForbiddenError extends HttpError {
  public constructor(body?: Record<string, any>) {
    super(STATUS_FORBIDDEN, {
      message: MESSAGE_FORBIDDEN,
      body,
    });
  }
}

export class HttpInternalServerError extends HttpError {
  public constructor(body?: Record<string, any>) {
    super(STATUS_INTERNAL_SERVER_ERROR, {
      message: MESSAGE_INTERNAL_SERVER_ERROR,
      body,
    });
  }
}

export class HttpServiceUnavailableError extends HttpError {
  public constructor(body?: Record<string, any>) {
    super(STATUS_SERVICE_UNAVAILABLE_ERROR, {
      message: MESSAGE_SERVICE_UNAVAILABLE_ERROR,
      body,
    });
  }
}

export class HttpGatewayTimeoutError extends HttpError {
  public constructor(body?: Record<string, any>) {
    super(STATUS_GATEWAY_TIMEOUT, {
      message: MESSAGE_GATEWAY_TIMEOUT,
      body,
    });
  }
}

export class ConnectionNotFound extends HttpNotFound {
  public constructor(id: string) {
    const body = { error: `Connection:${id} not found` };
    super(body);
  }
}

export class AccountNotFound extends HttpNotFound {
  public constructor(id: string) {
    const body = { error: `Account:${id} not found` };
    super(body);
  }
}

export class ConnectionUnauthorized extends HttpUnauthorized {
  public constructor(connectionId: string, accountId: string) {
    const body = {
      error: `Connection:${connectionId} doesn't belong to Account:${accountId}`,
    };
    super(body);
  }
}

export class ChannelNotConnected extends HttpUnauthorized {
  public constructor(id: string) {
    const body = { error: `Channel with connectionId:${id} not connected` };
    super(body);
  }
}
export class ChannelNotFound extends HttpUnauthorized {
  public constructor(name: string) {
    const body = {
      error: `Channel with name: ${name.toUpperCase()} not found`,
    };
    super(body);
  }
}
