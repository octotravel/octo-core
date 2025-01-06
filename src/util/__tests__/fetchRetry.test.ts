import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRetry } from '../fetchRetry';
import { SubRequestContext } from '../../models/SubRequestContext';
import { RequestMethod } from '../../types/Request';

describe('fetchRetry', () => {
  const url = 'https://octo.ventrata.com';
  let input: RequestInfo;
  let init: RequestInit | undefined;
  let request: Request;
  let response: Response | undefined;

  const RETRY_DELAY_MULTIPLIER_IN_MS = 10;

  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response('{}', { status: 200 }));
    });
  });

  describe('with input as string', () => {
    input = url;

    describe('without init', () => {
      init = undefined;

      describe('without provided subrequest context', () => {
        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
          response = await fetchRetry(input, init);
          expect(response.status).toBe(204);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(300);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(303);
        });

        it('should succeed at second retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at third retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should fail after three retries with server error response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(500);
        });

        it('should throw error at first try and succeed at second try with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error())
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, {
            retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
          });

          expect(response.status).toBe(200);
        });

        it('should throw error after three retries which throwed error', async () => {
          global.fetch = vi.fn().mockRejectedValue(new Error());

          const responseCallback = async (): Promise<Response> => {
            return await fetchRetry(input, init, {
              retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
            });
          };
          response = undefined;

          await expect(responseCallback).rejects.toThrowError(Error);
        });
      });

      describe('with provided subrequest context', () => {
        let subRequestContext: SubRequestContext;

        beforeEach(() => {
          request = new Request(url, { method: RequestMethod.Get, body: null });
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

          if (response !== undefined) {
            const consumedResponse = await response.text();
            expect(response.bodyUsed).toBe(true);
          }
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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

        it('should throw error at first try and succeed at second try with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error())
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, {
            subRequestContext,
            retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
          });
          const subrequestData = subRequestContext.getRequestData();

          expect(response.status).toBe(200);
          expect(subrequestData.getResponse().status).toBe(500);
          expect(subrequestData.getRetries()[0].getResponse().status).toBe(200);
          expect(subrequestData.getRetries().length).toBe(1);
        });

        it('should throw error after three retries which throwed error', async () => {
          global.fetch = vi.fn().mockRejectedValue(new Error());

          const responseCallback = async (): Promise<Response> => {
            return await fetchRetry(input, init, {
              subRequestContext,
              retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
            });
          };
          response = undefined;

          await expect(responseCallback).rejects.toThrowError(Error);
        });
      });
    });

    describe('with init', () => {
      init = {
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
        method: RequestMethod.Get,
      };

      describe('without provided subrequest context', () => {
        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
          response = await fetchRetry(input, init);
          expect(response.status).toBe(204);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(300);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(303);
        });

        it('should succeed at second retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at third retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should fail after three retries with server error response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(500);
        });

        it('should throw error at first try and succeed at second try with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error())
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, {
            retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
          });

          expect(response.status).toBe(200);
        });

        it('should throw error after three retries which throwed error', async () => {
          global.fetch = vi.fn().mockRejectedValue(new Error());

          const responseCallback = async (): Promise<Response> => {
            return await fetchRetry(input, init, {
              retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
            });
          };
          response = undefined;

          await expect(responseCallback).rejects.toThrowError(Error);
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

          if (response !== undefined) {
            const consumedResponse = await response.text();
            expect(response.bodyUsed).toBe(true);
          }
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
    });
  });

  describe('with input as Request object', () => {
    input = new Request(url, {
      method: RequestMethod.Get,
    });

    describe('without init', () => {
      init = undefined;

      describe('without provided subrequest context', () => {
        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
          response = await fetchRetry(input, init);
          expect(response.status).toBe(204);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(300);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(303);
        });

        it('should succeed at second retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at third retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should fail after three retries with server error response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
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

          if (response !== undefined) {
            const consumedResponse = await response.text();
            expect(response.bodyUsed).toBe(true);
          }
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
    });

    describe('with init', () => {
      init = {
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
        method: RequestMethod.Get,
      };

      describe('without provided subrequest context', () => {
        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
          response = await fetchRetry(input, init);
          expect(response.status).toBe(204);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(300);
        });

        it('should succeed at first try with redirection message', async () => {
          global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(303);
        });

        it('should succeed at second retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should succeed at third retry with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
          expect(response.status).toBe(200);
        });

        it('should fail after three retries with server error response', async () => {
          global.fetch = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
            .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
            .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
          response = await fetchRetry(input, init, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
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

          if (response !== undefined) {
            const consumedResponse = await response.text();
            expect(response.bodyUsed).toBe(true);
          }
        });

        it('should succeed at first try with successful response', async () => {
          global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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
          response = await fetchRetry(input, init, {
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

        it('should throw error at first try and succeed at second try with successful response', async () => {
          global.fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error())
            .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
          response = await fetchRetry(input, init, {
            subRequestContext,
            retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
          });
          const subrequestData = subRequestContext.getRequestData();

          expect(response.status).toBe(200);
          expect(subrequestData.getResponse().status).toBe(500);
          expect(subrequestData.getRetries()[0].getResponse().status).toBe(200);
          expect(subrequestData.getRetries().length).toBe(1);
        });

        it('should throw error after three retries which throwed error', async () => {
          global.fetch = vi.fn().mockRejectedValue(new Error());

          const responseCallback = async (): Promise<Response> => {
            return await fetchRetry(input, init, {
              subRequestContext,
              retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
            });
          };
          response = undefined;

          await expect(responseCallback).rejects.toThrowError(Error);
        });
      });
    });
  });
});
