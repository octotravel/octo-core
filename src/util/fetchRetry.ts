export async function fetchRetry(
  input: RequestInfo,
  init?: RequestInit,
  currentRetryAttempt = 0,
  maxRetryAttempts = 3,
): Promise<Response> {
  if (currentRetryAttempt > 0) {
    await new Promise((resolve) => setTimeout(resolve, (currentRetryAttempt + 1) * 1000));
  }

  currentRetryAttempt++;

  try {
    const res = await fetch(input, init);

    if (res === undefined) {
      return await fetchRetry(input, init, currentRetryAttempt, maxRetryAttempts);
    }

    const status = res.status;

    if ((status < 200 || status >= 400) && currentRetryAttempt < maxRetryAttempts) {
      return await fetchRetry(input, init, currentRetryAttempt, maxRetryAttempts);
    }

    return res;
  } catch (error: unknown) {
    if (currentRetryAttempt < maxRetryAttempts) {
      return await fetchRetry(input, init, currentRetryAttempt, maxRetryAttempts);
    }

    throw error;
  }
}
