import { SubRequestContext } from '../models/SubRequestContext';
import { BackendParams } from '../types/Backend';

const DEFAULT_MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MULTIPLIER_IN_MS = 1000;

export async function fetchRetry(
  input: RequestInfo,
  init?: RequestInit,
  params: BackendParams | null = null,
  currentRetryAttempt = 0,
  maxRetryAttempts = DEFAULT_MAX_RETRY_ATTEMPTS,
): Promise<Response> {
  const subRequestContext = new SubRequestContext();

  if (params !== null) {
    const request: Request = input instanceof Request ? input : new Request(input, init);

    // Init subrequest data here, so timeout counts towards the request duration
    subRequestContext.initRequestData({
      request,
      requestId: params.ctx.getRequestId(),
      accountId: params.ctx.getAccountId(),
    });
  }

  if (currentRetryAttempt > 0) {
    await new Promise((resolve) => setTimeout(resolve, (currentRetryAttempt + 1) * RETRY_DELAY_MULTIPLIER_IN_MS));
  }

  currentRetryAttempt++;

  let res: Response | undefined;
  let error: Error | undefined;

  try {
    res = await fetch(input, init);
  } catch (e: unknown) {
    res = new Response(null, { status: 500, statusText: 'Cant get any response data, something went horrinly wrong.' });

    if (e instanceof Error) {
      error = e;
    }
  }

  const requestData = subRequestContext.getRequestData(res, error);

  if (currentRetryAttempt > 0) {
    requestData.isRetry = true;
  }

  if (params !== null) {
    params.ctx.addSubrequest(requestData);
  }

  if (res === undefined && currentRetryAttempt < maxRetryAttempts) {
    return await fetchRetry(input, init, params, currentRetryAttempt, maxRetryAttempts);
  }

  const status = res.status;

  if ((status < 200 || status >= 400) && currentRetryAttempt < maxRetryAttempts) {
    return await fetchRetry(input, init, params, currentRetryAttempt, maxRetryAttempts);
  }

  if (error !== undefined) {
    throw error;
  }

  return res;
}
