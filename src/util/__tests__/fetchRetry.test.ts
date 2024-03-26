import { beforeEach, describe, expect, it, vi } from 'vitest';
import fetchRetry from '../fetchRetry';

describe('API', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response());
    });
  });

  describe('fetch', () => {
    it('should succeed at first try', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(200);
    });

    it('should succeed at second retry', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(200);
    });

    it('should succeed at third retry', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValue(Promise.resolve(new Response('{}', { status: 200 })));
      const response = await fetchRetry('https://octo.ventrata.com');
      expect(response.status).toBe(200);
    });

    it('should fail after three retries', async () => {
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
