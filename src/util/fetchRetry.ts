import { HeaderParser } from '../models/HeaderParser';
import { SubRequestContext } from '../models/SubRequestContext';
import { SubRequestRetryContext } from '../models/SubRequestRetryContext';

const DEFAULT_MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_AFTER = 0;
const DEFAULT_RETRY_DELAY_MULTIPLIER_IN_MS = 1000;
const DEFAULT_RETRY_ON_STATUS = [500, 502, 503, 504, 506, 507, 508, 510, 511];
const FETCH_RETRY_DEFAULT_OPTIONS: Required<FetchRetryOptions> = {
  subRequestContext: null,
  timeoutInMs: null,
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
  timeoutInMs?: number | null;
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

/**
 * Cancel a response body we are not going to hand back to the caller.
 *
 * Under undici (Node's global fetch) the socket backing a response stays
 * checked out of the connection pool until the body is fully consumed or
 * cancelled. Any response we discard on a retry — or the throwaway clone we
 * pass to `shouldForceRetry` — must therefore be released explicitly, otherwise
 * the connection leaks until GC finalizers eventually run and, under load, the
 * pool is exhausted.
 */
async function releaseResponseBody(response: Response | undefined): Promise<void> {
  if (response === undefined || response.body === null || response.bodyUsed) {
    return;
  }

  try {
    await response.body.cancel();
  } catch {
    // The body may already be locked/partially consumed by a caller-supplied
    // predicate — nothing more we can do, and it is not fatal.
  }
}

/**
 * Discard a response we are retrying past, together with the throwaway clone we
 * handed to `shouldForceRetry`.
 *
 * `res.clone()` tees the underlying stream, and undici only returns the socket
 * to the pool once *every* tee branch is consumed or cancelled. Cancelling the
 * branches one after another deadlocks — awaiting `.cancel()` on one branch does
 * not settle until the sibling branch is also released — so both branches must
 * be cancelled concurrently.
 */
async function discardRetriedResponse(res: Response, inspectionResponse: Response): Promise<void> {
  await Promise.all([releaseResponseBody(res), releaseResponseBody(inspectionResponse)]);
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
    let fetchRequest = request.clone();

    if (options.timeoutInMs !== null && options.timeoutInMs !== undefined) {
      const timeoutSignal = AbortSignal.timeout(options.timeoutInMs);
      fetchRequest = new Request(fetchRequest, {
        signal: AbortSignal.any([fetchRequest.signal, timeoutSignal]),
      });
    }

    res = await options.fetchImplementation(fetchRequest);
  } catch (e: unknown) {
    res = new Response(
      JSON.stringify({ error: `Unable to retrieve a response from the server. Please try again later. (${e})` }),
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

  if (options.currentRetryAttempt < options.maxRetryAttempts) {
    // The predicate only matters when a retry is still on the table, so it runs
    // here rather than unconditionally (on the terminal attempt it would just
    // buffer the body of the response we are about to return). It gets a
    // throwaway clone so it can inspect the body without consuming `res`.
    const inspectionResponse = res.clone();
    const shouldForceRetryResult = await options.shouldForceRetry(inspectionResponse);

    if (shouldForceRetryResult.forceRetry) {
      const retryAfter = shouldForceRetryResult.retryAfter;

      if (retryAfter > 0) {
        options.retryAfter = retryAfter;
      }

      // Release the connections tied to the response we are discarding.
      await discardRetriedResponse(res, inspectionResponse);
      return await fetchRetry(request, options);
    }

    const status = res.status;
    const retryAfter = HeaderParser.getRetryAfterInSeconds(res);

    if (
      (options.retryOnStatus.includes(status) || (status === 429 && retryAfter > 0)) &&
      request.signal.aborted === false
    ) {
      if (retryAfter > 0) {
        options.retryAfter = retryAfter;
      }

      if (options.retryAfter <= options.currentRetryAttempt) {
        // Release the connections tied to the response we are discarding.
        await discardRetriedResponse(res, inspectionResponse);
        return await fetchRetry(request, options);
      }
    }

    // We are keeping `res` and handing it back to the caller. The inspection
    // clone must still be released so its tee branch does not pin the
    // connection, but we must not await it: its cancellation only settles once
    // the caller consumes `res`, which happens after this function returns.
    void releaseResponseBody(inspectionResponse);

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
