import { SubRequestContext } from '../models/SubRequestContext';
import { SubRequestRetryContext } from '../models/SubRequestRetryContext';

const DEFAULT_MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS = 1000;
const FETCH_RETRY_DEFAULT_OPTIONS = {
  subRequestContext: null,
  currentRetryAttempt: 0,
  maxRetryAttempts: DEFAULT_MAX_RETRY_ATTEMPTS,
  retryDelayMultiplierInMs: DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS,
  fetchImplementation: async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    return await fetch(input, init);
  },
  shouldForceRetry: async (status: number, response: Response): Promise<boolean> => false,
};

export interface FetchRetryOptions {
  subRequestContext?: SubRequestContext | null;
  currentRetryAttempt?: number;
  maxRetryAttempts?: number;
  retryDelayMultiplierInMs?: number;
  fetchImplementation?: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
  shouldForceRetry?: (status: number, response: Response) => Promise<boolean>;
}

export async function fetchRetry(
  input: RequestInfo,
  init?: RequestInit,
  options: FetchRetryOptions = FETCH_RETRY_DEFAULT_OPTIONS,
): Promise<Response> {
  let {
    subRequestContext = null,
    currentRetryAttempt = 0,
    maxRetryAttempts = DEFAULT_MAX_RETRY_ATTEMPTS,
    retryDelayMultiplierInMs = DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS,
    fetchImplementation = async (input: string | URL | Request, init?: RequestInit) =>
      await FETCH_RETRY_DEFAULT_OPTIONS.fetchImplementation(input, init),
    shouldForceRetry = async (status: number, response: Response) =>
      await FETCH_RETRY_DEFAULT_OPTIONS.shouldForceRetry(status, response),
  } = options;
  let subRequestRetryContext: SubRequestRetryContext | null = null;
  let request: Request;

  if (typeof input === 'string' || input instanceof String) {
    request = new Request(input, init);
  } else {
    request = input;
  }

  if (currentRetryAttempt > 0) {
    if (subRequestContext !== null) {
      if (subRequestContext !== null) {
        subRequestRetryContext = new SubRequestRetryContext({
          request,
          accountId: subRequestContext.getAccountId(),
          requestId: subRequestContext.getRequestId(),
          subRequestId: subRequestContext.getId(),
        });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, (currentRetryAttempt + 1) * retryDelayMultiplierInMs));
  }
  let res: Response | undefined;
  let error: Error | null = null;

  try {
    res = await fetchImplementation(request.clone());
  } catch (e: unknown) {
    res = new Response(JSON.stringify({ error: 'Cant get any response data, something went horribly wrong.' }), {
      status: 500,
    });

    if (e instanceof Error) {
      error = e;
    }
  }

  if (currentRetryAttempt === 0 && subRequestContext !== null) {
    subRequestContext.setResponse(res);
    subRequestContext.setError(error);
  } else if (currentRetryAttempt > 0 && subRequestContext !== null && subRequestRetryContext !== null) {
    subRequestRetryContext.setResponse(res);
    subRequestRetryContext.setError(error);
    const requestData = subRequestRetryContext.getRequestData();
    subRequestContext.addRetry(requestData);
  }

  currentRetryAttempt++;

  const status = res.status;

  if (
    ((status >= 500 && status < 599) || status === 429 || (await shouldForceRetry(status, res.clone()))) &&
    currentRetryAttempt < maxRetryAttempts
  ) {
    return await fetchRetry(request, undefined, {
      subRequestContext,
      currentRetryAttempt,
      maxRetryAttempts,
      retryDelayMultiplierInMs,
      fetchImplementation,
      shouldForceRetry,
    });
  } else {
    // Retry is not needed anymore, so we can consume the request object
    request.text();
  }

  if (error !== null) {
    throw error;
  }

  return res;
}
