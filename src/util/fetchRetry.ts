import { HeaderParser } from '../models/HeaderParser';
import { SubRequestContext } from '../models/SubRequestContext';
import { SubRequestRetryContext } from '../models/SubRequestRetryContext';

const DEFAULT_MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_AFTER = 0;
const DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS = 1000;
const DEFAULT_RETRY_ON_STATUS = [429, 500, 502, 503, 504, 506, 507, 508, 510, 511];
const FETCH_RETRY_DEFAULT_OPTIONS: Required<FetchRetryOptions> = {
  subRequestContext: null,
  currentRetryAttempt: 0,
  maxRetryAttempts: DEFAULT_MAX_RETRY_ATTEMPTS,
  retryAfter: DEFAULT_RETRY_AFTER,
  retryDelayMultiplierInMs: DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS,
  retryOnStatus: DEFAULT_RETRY_ON_STATUS,
  fetchImplementation: async (request: Request): Promise<Response> => {
    return await fetch(request);
  },
  shouldForceRetry: async (response: Response): Promise<ShouldForceRetryResult> => {
    // consume the cloned response object
    await response.text();
    return {
      forceRetry: false,
      retryAfter: 1,
    };
  },
};

export interface FetchRetryOptions {
  subRequestContext?: SubRequestContext | null;
  currentRetryAttempt?: number;
  maxRetryAttempts?: number;
  retryAfter?: number;
  retryDelayMultiplierInMs?: number;
  retryOnStatus?: number[];
  fetchImplementation?: (request: Request) => Promise<Response>;
  shouldForceRetry?: (response: Response) => Promise<ShouldForceRetryResult>;
}

export interface ShouldForceRetryResult {
  forceRetry: boolean;
  retryAfter: number;
}

export async function fetchRetry(
  request: Request,
  defaultOptions: FetchRetryOptions = FETCH_RETRY_DEFAULT_OPTIONS,
): Promise<Response> {
  const options: Required<FetchRetryOptions> = {
    ...FETCH_RETRY_DEFAULT_OPTIONS,
    ...defaultOptions,
  };

  let subRequestRetryContext: SubRequestRetryContext | null = null;

  if (options.currentRetryAttempt > 0) {
    if (options.subRequestContext !== null && options.subRequestContext !== undefined) {
      subRequestRetryContext = new SubRequestRetryContext({
        request,
        accountId: options.subRequestContext.getAccountId(),
        requestId: options.subRequestContext.getRequestId(),
        subRequestId: options.subRequestContext.getId(),
      });
    }

    let retryDelayInMs = (options.currentRetryAttempt + 1) * options.retryDelayMultiplierInMs;

    if (options.retryAfter > 0) {
      retryDelayInMs = options.retryAfter * 1000;
    }

    await new Promise((resolve) => setTimeout(resolve, retryDelayInMs));
  }

  let res: Response | undefined;
  let error: Error | null = null;

  try {
    res = await options.fetchImplementation(request.clone());
  } catch (e: unknown) {
    res = new Response(
      JSON.stringify({ error: 'Unable to retrieve a response from the server. Please try again later.' }),
      {
        status: 500,
      },
    );

    if (e instanceof Error) {
      error = e;
    }
  }

  if (
    options.currentRetryAttempt === 0 &&
    options.subRequestContext !== null &&
    options.subRequestContext !== undefined
  ) {
    options.subRequestContext.setResponse(res);
    options.subRequestContext.setError(error);
  } else if (
    options.currentRetryAttempt > 0 &&
    options.subRequestContext !== null &&
    options.subRequestContext !== undefined &&
    subRequestRetryContext !== null
  ) {
    subRequestRetryContext.setResponse(res);
    subRequestRetryContext.setError(error);
    const requestData = subRequestRetryContext.getRequestData();
    options.subRequestContext.addRetry(requestData);
  }

  options.currentRetryAttempt++;

  const shouldForceRetryResult = await options.shouldForceRetry(res.clone());

  if (options.currentRetryAttempt < options.maxRetryAttempts) {
    if (shouldForceRetryResult.forceRetry) {
      const retryAfter = shouldForceRetryResult.retryAfter;

      if (retryAfter > 0) {
        options.retryAfter = retryAfter;
      }

      return await fetchRetry(request, options);
    }

    const status = res.status;

    if (options.retryOnStatus.includes(status)) {
      const retryAfter = HeaderParser.getRetryAfterInSeconds(res);

      if (retryAfter > 0) {
        options.retryAfter = retryAfter;
      }

      if (options.retryAfter <= options.currentRetryAttempt) {
        return await fetchRetry(request, options);
      }
    }

    // Retry is not needed anymore, so we can consume the request object
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.bodyUsed === false) {
      try {
        await request.text();
      } catch (e: unknown) {
        // ignore
      }
    }
  }

  if (error !== null) {
    throw error;
  }

  return res;
}
