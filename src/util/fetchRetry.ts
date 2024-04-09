import { SubRequestContext } from '../models/SubRequestContext';
import { SubRequestRetryContext } from '../models/SubRequestRetryContext';

const DEFAULT_MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS = 1000;
const FETCH_RETRY_DEFAULT_OPTIONS = {
  subrequestContext: null,
  currentRetryAttempt: 0,
  maxRetryAttempts: DEFAULT_MAX_RETRY_ATTEMPTS,
  retryDelayMultiplierInMs: DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS,
};

export interface FetchRetryOptions {
  subRequestContext?: SubRequestContext | null;
  currentRetryAttempt?: number;
  maxRetryAttempts?: number;
  retryDelayMultiplierInMs?: number;
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
  } = options;
  let subRequestRetryContext: SubRequestRetryContext | null = null;

  if (currentRetryAttempt > 0) {
    if (subRequestContext !== null) {
      const request: Request = input instanceof Request ? input : new Request(input, init);

      subRequestRetryContext = new SubRequestRetryContext({
        request,
        accountId: subRequestContext.getAccountId(),
        requestId: subRequestContext.getRequestId(),
        subRequestId: subRequestContext.getId(),
      });
    }

    await new Promise((resolve) => setTimeout(resolve, (currentRetryAttempt + 1) * retryDelayMultiplierInMs));
  }

  let res: Response | undefined;
  let error: Error | null = null;

  try {
    res = await fetch(input, init);
  } catch (e: unknown) {
    res = new Response(null, { status: 500, statusText: 'Cant get any response data, something went horrinly wrong.' });

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

  if (res === undefined && currentRetryAttempt < maxRetryAttempts) {
    return await fetchRetry(input, init, {
      subRequestContext,
      currentRetryAttempt,
      maxRetryAttempts,
      retryDelayMultiplierInMs,
    });
  }

  const status = res.status;

  if ((status < 200 || status >= 400) && currentRetryAttempt < maxRetryAttempts) {
    return await fetchRetry(input, init, {
      subRequestContext,
      currentRetryAttempt,
      maxRetryAttempts,
      retryDelayMultiplierInMs,
    });
  }

  if (error !== null) {
    throw error;
  }

  return res;
}
