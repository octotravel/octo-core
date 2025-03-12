import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SubRequestContext } from '../../models/SubRequestContext';
import { RequestMethod } from '../../types/Request';
import { ShouldForceRetryResult, fetchRetry } from '../fetchRetry';

describe('fetchRetry', () => {
  const url = 'https://octo.ventrata.com';
  let request: Request;
  let response: Response | undefined;
  let error: Error | undefined;

  const RETRY_DELAY_MULTIPLIER_IN_MS = 10;

  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response('{}', { status: 200 }));
    });
    request = new Request(url, {
      method: RequestMethod.Get,
    });
  });

  describe('without provided subrequest context', () => {
    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      response = await fetchRetry(request, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(200);
    });

    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
      response = await fetchRetry(request);
      expect(response.status).toBe(204);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
      response = await fetchRetry(request, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(300);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
      response = await fetchRetry(request, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(303);
    });

    it('should succeed at second retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      response = await fetchRetry(request, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(200);
    });

    it('should succeed at third retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
      response = await fetchRetry(request, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(200);
    });

    it('should fail after three retries with server error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      response = await fetchRetry(request, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(500);
    });
  });

  describe('with provided subrequest context', () => {
    let subRequestContext: SubRequestContext;

    beforeEach(() => {
      request = new Request(url, { method: RequestMethod.Get });
      subRequestContext = new SubRequestContext({
        request,
        accountId: '2635034e-3094-428b-b8f0-9d0cc0960c0c',
        requestId: '89d08dfb-6bff-4ad6-b01c-1b2f643fddce',
      });
    });

    afterEach(async () => {
      const subrequestData = subRequestContext.getRequestData();
      const subrequestRequest = subrequestData.getRequest();
      const subrequestResponse = subrequestData.getResponse();

      const consumedSubrequestRequest = await subrequestRequest.text();
      const consumedSubrequestResponse = await subrequestResponse.text();

      if (subrequestRequest.body !== null) {
        expect(subrequestRequest.bodyUsed).toBe(true);
      }
      expect(subrequestResponse.bodyUsed).toBe(true);

      for (const subrequestRetryData of subrequestData.getRetries()) {
        const retryRequest = subrequestRetryData.getRequest();
        const retryResponse = subrequestRetryData.getResponse();

        const consumedRetryRequest = await retryRequest.text();
        const consumedRetryResponse = await retryResponse.text();

        if (retryRequest.body !== null) {
          expect(retryRequest.bodyUsed).toBe(true);
        }
        expect(retryResponse.bodyUsed).toBe(true);
      }

      const consumedRequest = await request.text();
      if (request.body !== null) {
        expect(request.bodyUsed).toBe(true);
      }

      if (response !== undefined && error === undefined) {
        const consumedResponse = await response.text();
        expect(response.bodyUsed).toBe(true);
      }
    });

    describe('should test basic retry logic', () => {
      it('should succeed at first try with successful response', async () => {
        global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
        });
        const subrequestData = subRequestContext.getRequestData();

        expect(response.status).toBe(200);
        expect(subrequestData.getResponse().status).toBe(200);
        expect(subrequestData.getRetries().length).toBe(0);
      });

      it('should succeed at second retry with successful response', async () => {
        global.fetch = vi
          .fn()
          .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
          .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
        });
        const subrequestData = subRequestContext.getRequestData();

        expect(response.status).toBe(200);
        expect(subrequestData.getResponse().status).toBe(503);
        expect(subrequestData.getRetries().length).toBe(1);
        expect(subrequestData.getRetries()[0].getResponse().status).toBe(200);
      });

      it('should succeed at third retry with successful response', async () => {
        global.fetch = vi
          .fn()
          .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
          .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
          .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
        });
        const subrequestData = subRequestContext.getRequestData();

        expect(response.status).toBe(200);
        expect(subrequestData.getResponse().status).toBe(503);
        expect(subrequestData.getRetries().length).toBe(2);
        expect(subrequestData.getRetries()[0].getResponse().status).toBe(502);
        expect(subrequestData.getRetries()[1].getResponse().status).toBe(200);
      });

      it('should fail after three retries with server error response', async () => {
        global.fetch = vi
          .fn()
          .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
          .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
          .mockReturnValueOnce(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
        });
        const subrequestData = subRequestContext.getRequestData();

        expect(response.status).toBe(500);
        expect(subrequestData.getResponse().status).toBe(503);
        expect(subrequestData.getRetries().length).toBe(2);
        expect(subrequestData.getRetries()[0].getResponse().status).toBe(502);
        expect(subrequestData.getRetries()[1].getResponse().status).toBe(500);
      });
    });

    describe('should use retry-after header', () => {
      it('should succeed at third retry with successful response using retry-after header', async () => {
        global.fetch = vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve(
              new Response('500 Internal Server Error', { status: 500, headers: { 'Retry-After': '1' } }),
            ),
          )
          .mockReturnValueOnce(
            Promise.resolve(
              new Response('500 Internal Server Error', { status: 500, headers: { 'Retry-After': '1' } }),
            ),
          )
          .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200, headers: { 'Retry-After': '1' } })));
        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
        });
        const subrequestData = subRequestContext.getRequestData();
        expect(response.status).toBe(200);
        expect(subrequestData.getResponse().status).toBe(500);
        expect(subrequestData.getRetries().length).toBe(2);
        expect(subrequestData.getRetries()[0].getResponse().status).toBe(500);
        expect(subrequestData.getRetries()[1].getResponse().status).toBe(200);
      });

      it('should fail without any retries based on high value in retry-again header', async () => {
        global.fetch = vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve(
              new Response('500 Internal Server Error', { status: 500, headers: { 'Retry-After': '100' } }),
            ),
          );
        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
        });
        expect(response.status).toBe(500);
      });
    });

    describe('should use force retry callback', () => {
      it('should succeed at third retry with successful response using retry-after header', async () => {
        global.fetch = vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve(
              new Response(
                JSON.stringify({
                  error: 'TOO_MANY_REQUESTS',
                  errorMessage: 'Too many requests, please retry later',
                  retryAfter: 1,
                }),
                { status: 400 },
              ),
            ),
          )
          .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));

        response = await fetchRetry(request, {
          subRequestContext,
          retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
          shouldForceRetry: async (response: Response): Promise<ShouldForceRetryResult> => {
            try {
              if (response.status !== 400) {
                return { forceRetry: false, retryAfter: 0 };
              }

              const jsonResponse = await response.clone().json();

              if (
                jsonResponse.error &&
                jsonResponse.error === 'TOO_MANY_REQUESTS' &&
                jsonResponse.retryAfter &&
                jsonResponse.retryAfter > 0
              ) {
                return { forceRetry: true, retryAfter: jsonResponse.retryAfter };
              }

              return { forceRetry: false, retryAfter: 0 };
            } catch (e: unknown) {
              return { forceRetry: false, retryAfter: 0 };
            }
          },
        });
        const subrequestData = subRequestContext.getRequestData();
        expect(response.status).toBe(200);
        expect(subrequestData.getResponse().status).toBe(400);
        expect(subrequestData.getRetries().length).toBe(1);
        expect(subrequestData.getRetries()[0].getResponse().status).toBe(200);
      });
    });

    it('should fail the first try due to unknown error in fetch then succeed', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.reject(new Error('Unknown error')))
        .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));

      response = await fetchRetry(request, {
        subRequestContext,
        retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
      });
      const subrequestData = subRequestContext.getRequestData();
      expect(response.status).toBe(200);
      expect(subrequestData.getResponse().status).toBe(500);
      expect(await subrequestData.getResponse().clone().json()).toStrictEqual({
        error: 'Unable to retrieve a response from the server. Please try again later.',
      });
      expect(subrequestData.getRetries().length).toBe(1);
      expect(subrequestData.getRetries()[0].getResponse().status).toBe(200);
    });

    it('should fail due to unknown error in fetch implementation', async () => {
      const unknownError = new Error('Unknown error');

      global.fetch = vi.fn().mockRejectedValue(unknownError);

      await expect(
        fetchRetry(request, { subRequestContext, retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS }),
      ).rejects.toThrowError(unknownError);
      error = unknownError;
    });
  });
});
