import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRetry } from '../fetchRetry';
import { SubRequestContext } from '../../models/SubRequestContext';

describe('fetchRetry', () => {
  const url: string = 'https://octo.ventrata.com';
  const RETRY_DELAY_MULTIPLIER_IN_MS = 10;

  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response());
    });
  });

  describe('without provided subrequest context', () => {
    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(200);
    });

    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(204);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(300);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(303);
    });

    it('should succeed at second retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(200);
    });

    it('should succeed at third retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(200);
    });

    it('should fail after three retries with client error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('403 Forbidden', { status: 403 })))
        .mockReturnValueOnce(Promise.resolve(new Response('401 Unauthorized', { status: 401 })))
        .mockReturnValue(Promise.resolve(new Response('400 Bad Request', { status: 400 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(400);
    });

    it('should fail after three retries with server error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      const response = await fetchRetry(url, undefined, { retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS });
      expect(response.status).toBe(500);
    });
  });

  describe('with provided subrequest context', () => {
    let subRequestContext: SubRequestContext;

    beforeEach(() => {
      subRequestContext = new SubRequestContext({
        request: new Request(url),
        accountId: '2635034e-3094-428b-b8f0-9d0cc0960c0c',
        requestId: '89d08dfb-6bff-4ad6-b01c-1b2f643fddce',
      });
    });

    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      const response = await fetchRetry(url, undefined, {
        subRequestContext,
        retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
      });
      const subrequestData = subRequestContext.getRequestData();

      expect(response.status).toBe(200);
      expect(subrequestData.response.status).toBe(200);
      expect(subrequestData.retries.length).toBe(0);
    });

    it('should succeed at second retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry(url, undefined, {
        subRequestContext,
        retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
      });
      const subrequestData = subRequestContext.getRequestData();

      expect(response.status).toBe(200);
      expect(subrequestData.response.status).toBe(503);
      expect(subrequestData.retries.length).toBe(1);
      expect(subrequestData.retries[0].response.status).toBe(200);
    });

    it('should succeed at third retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry(url, undefined, {
        subRequestContext,
        retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
      });
      const subrequestData = subRequestContext.getRequestData();

      expect(response.status).toBe(200);
      expect(subrequestData.response.status).toBe(503);
      expect(subrequestData.retries.length).toBe(2);
      expect(subrequestData.retries[0].response.status).toBe(502);
      expect(subrequestData.retries[1].response.status).toBe(200);
    });

    it('should fail after three retries with server error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValueOnce(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      const response = await fetchRetry(url, undefined, {
        subRequestContext,
        retryDelayMultiplierInMs: RETRY_DELAY_MULTIPLIER_IN_MS,
      });
      const subrequestData = subRequestContext.getRequestData();

      expect(response.status).toBe(500);
      expect(subrequestData.response.status).toBe(503);
      expect(subrequestData.retries.length).toBe(2);
      expect(subrequestData.retries[0].response.status).toBe(502);
      expect(subrequestData.retries[1].response.status).toBe(500);
    });
  });
});
