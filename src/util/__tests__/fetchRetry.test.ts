import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRetry } from '../fetchRetry';
import { RequestContext } from '../../models/RequestContext';
import { BackendParams } from '../../types/Backend';

describe('fetchRetry', () => {
  const url: string = 'https://octo.ventrata.com';

  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response());
    });
  });

  describe('without backend params', () => {
    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(200);
    });

    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(204);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(300);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(303);
    });

    it('should succeed at second retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(200);
    });

    it('should succeed at third retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(200);
    });

    it('should fail after three retries with client error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('403 Forbidden', { status: 403 })))
        .mockReturnValueOnce(Promise.resolve(new Response('401 Unauthorized', { status: 401 })))
        .mockReturnValue(Promise.resolve(new Response('400 Bad Request', { status: 400 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(400);
    });

    it('should fail after three retries with server error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      const response = await fetchRetry(url);
      expect(response.status).toBe(500);
    });
  });

  describe('with backend params', () => {
    let params: BackendParams;
    let requestContext: RequestContext;

    beforeEach(() => {
      requestContext = new RequestContext({
        request: new Request(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      });

      requestContext.setConnection({
        id: '89d08dfb-6bff-4ad6-b01c-1b2f643fddce',
        supplierId: '56e214cb-cf04-4741-8851-92603d4bda3d',
        apiKey: '04c45167-d015-469f-9340-ca84e1d8655c',
        endpoint: url,
        accountId: '2635034e-3094-428b-b8f0-9d0cc0960c0c',
        name: 'testConnection',
      });

      params = { ctx: requestContext };
    });

    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      await fetchRetry(url, undefined, { params });

      expect(requestContext.getSubrequest()[0].response.status).toBe(200);
      expect(requestContext.getSubrequest().length).toBe(1);
    });

    it('should succeed at second retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      await fetchRetry(url, undefined, { params });

      expect(requestContext.getSubrequest()[0].response.status).toBe(503);
      expect(requestContext.getSubrequest()[1].response.status).toBe(200);
      expect(requestContext.getSubrequest().length).toBe(2);
    });

    it('should succeed at third retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      await fetchRetry(url, undefined, { params });

      expect(requestContext.getSubrequest()[0].response.status).toBe(503);
      expect(requestContext.getSubrequest()[1].response.status).toBe(502);
      expect(requestContext.getSubrequest()[2].response.status).toBe(200);
      expect(requestContext.getSubrequest().length).toBe(3);
    });

    it('should fail after three retries with server error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValueOnce(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      await fetchRetry(url, undefined, { params });

      const subrequests = requestContext.getSubrequest();
      expect(subrequests[0].response.status).toBe(503);
      expect(subrequests[1].response.status).toBe(502);
      expect(subrequests[2].response.status).toBe(500);
      expect(requestContext.getSubrequest().length).toBe(3);
    });
  });
});
