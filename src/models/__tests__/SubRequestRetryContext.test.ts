import { beforeEach, describe, expect, it } from 'vitest';
import { SubRequestRetryContext } from '../SubrequestRetryContext';
import { SubRequestRetryData } from '../SubRequestRetryData';

describe('SubRequestRetryContext', () => {
  let context: SubRequestRetryContext;
  const request = new Request('http://example.com', { method: 'GET' });
  const accountId = '2635034e-3094-428b-b8f0-9d0cc0960c0c';
  const requestId = '89d08dfb-6bff-4ad6-b01c-1b2f643fddce';
  const subRequestId = 'dbd751df-be23-435f-a0ae-2bc5b1dc6c26';

  beforeEach(() => {
    context = new SubRequestRetryContext({
      request,
      accountId,
      requestId,
      subRequestId,
    });
  });

  describe('constructor', () => {
    it('should initialize class properties correctly in the constructor', () => {
      expect(context.getAccountId()).toBe(accountId);
      expect(context.getRequestId()).toBe(requestId);
      expect(context.getSubRequestId()).toBe(subRequestId);
      expect(context.getSubRequestRetryId()).toBeDefined();
    });
  });

  describe('setResponse', () => {
    it('should set response correctly', () => {
      const response = new Response(null, { status: 204 });
      context.setResponse(response);
      expect(context.getResponse()).toBe(response);
    });
  });

  describe('setError', () => {
    it('should set error correctly', () => {
      const error = new Error('Test Error');
      context.setError(error);
      expect(context.getError()).toBe(error);
    });
  });

  describe('enableLogs', () => {
    it('should enable logs', () => {
      context.enableLogs();
      expect(context.areLogsEnabled()).toBe(true);
    });
  });

  describe('disableLogs', () => {
    it('should disable logs', () => {
      context.disableLogs();
      expect(context.areLogsEnabled()).toBe(false);
    });
  });

  describe('getRequestData', () => {
    it('should construct and return SubRequestRetryData object with correct data', () => {
      const response = new Response(null, { status: 204 });
      context.setResponse(response);

      const subRequestRetryData: SubRequestRetryData = context.getRequestData();
      expect(subRequestRetryData.id).toBe(`${accountId}/${requestId}/${subRequestId}/${subRequestId}`);
      expect(subRequestRetryData.request).toBe(request);
      expect(subRequestRetryData.response).toBe(response);
      expect(subRequestRetryData.error).toBe(null);
      expect(subRequestRetryData.metadata.id).toBe(subRequestId);
      expect(subRequestRetryData.metadata.requestId).toBe(requestId);
      expect(subRequestRetryData.metadata.url).toBe(request.url);
      expect(subRequestRetryData.metadata.method).toBe(request.method);
      expect(subRequestRetryData.metadata.status).toBe(response.status);
      expect(subRequestRetryData.metadata.success).toBe(response.ok);
      expect(subRequestRetryData.metadata.duration).toBeDefined();
    });
  });

  it('should return the expected values from getter methods', () => {
    expect(context.getAccountId()).toBe(accountId);
    expect(context.getRequestId()).toBe(requestId);
    expect(context.getSubRequestId()).toBe(subRequestId);
    expect(context.getSubRequestRetryId()).toBeDefined();
  });
});
