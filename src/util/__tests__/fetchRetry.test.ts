import { beforeEach, describe, expect, it, vi } from 'vitest';
import fetchRetry from '../fetchRetry';

describe('API', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response());
    });
  });

  describe('fetch', () => {
    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(200);
    });

    it('should succeed at first try with successful response', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response(null, { status: 204 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(204);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 300 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(300);
    });

    it('should succeed at first try with redirection message', async () => {
      global.fetch = vi.fn().mockReturnValue(Promise.resolve(new Response(null, { status: 303 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(303);
    });

    it('should succeed at second retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(200);
    });

    it('should succeed at third retry with successful response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(200);
    });

    it('should fail after three retries with client error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('403 Forbidden', { status: 403 })))
        .mockReturnValueOnce(Promise.resolve(new Response('401 Unauthorized', { status: 401 })))
        .mockReturnValue(Promise.resolve(new Response('400 Bad Request', { status: 400 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(400);
    });

    it('should fail after three retries with server error response', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(500);
    });
  });
});
