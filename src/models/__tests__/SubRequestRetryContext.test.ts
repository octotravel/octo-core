import { beforeEach, describe, expect, it } from 'vitest';
import { SubRequestRetryContext } from '../SubRequestRetryContext';
import { SubRequestRetryData } from '../SubRequestRetryData';
import { RequestMethod } from '../../types/Request';
import { SubRequestRetryDataDataProvider } from './dataProviders/SubRequestRetryDataDataProvider';

describe('SubRequestRetryContext', () => {
  let subRequestRetryDataDataProvider: SubRequestRetryDataDataProvider;
  let subRequestRetryContext: SubRequestRetryContext;
  const request = new Request('http://example.com', { method: RequestMethod.Get });

  beforeEach(() => {
    subRequestRetryDataDataProvider = new SubRequestRetryDataDataProvider();
    subRequestRetryContext = new SubRequestRetryContext({
      request: subRequestRetryDataDataProvider.request,
      accountId: subRequestRetryDataDataProvider.accountId,
      requestId: subRequestRetryDataDataProvider.requestId,
      subRequestId: subRequestRetryDataDataProvider.subRequestId,
    });
  });

  describe('constructor', () => {
    it('should correctly initialize class properties', () => {
      expect(subRequestRetryContext.getId()).toBeDefined();
      expect(subRequestRetryContext.getRequest()).toContain(request);
      expect(subRequestRetryContext.getAccountId()).toBe(subRequestRetryDataDataProvider.accountId);
      expect(subRequestRetryContext.getRequestId()).toBe(subRequestRetryDataDataProvider.requestId);
      expect(subRequestRetryContext.getSubRequestId()).toBe(subRequestRetryDataDataProvider.subRequestId);
    });
  });

  describe('getResponse', () => {
    it('should get null response', () => {
      expect(subRequestRetryContext.getResponse()).toEqual(null);
    });
  });

  describe('setResponse', () => {
    it('should set non null response', () => {
      subRequestRetryContext.setResponse(subRequestRetryDataDataProvider.response);
      expect(subRequestRetryContext.getResponse()).toContain(subRequestRetryDataDataProvider.response);
    });

    it('should set null response', () => {
      const response = null;
      subRequestRetryContext.setResponse(response);
      expect(subRequestRetryContext.getResponse()).toEqual(response);
    });
  });

  describe('setError', () => {
    it('should set non null error', () => {
      subRequestRetryContext.setError(subRequestRetryDataDataProvider.error);
      expect(subRequestRetryContext.getError()).toBe(subRequestRetryDataDataProvider.error);
    });
  });

  describe('enableLogs', () => {
    it('should enable logs', () => {
      subRequestRetryContext.enableLogs();
      expect(subRequestRetryContext.areLogsEnabled()).toBe(true);
    });
  });

  describe('disableLogs', () => {
    it('should disable logs', () => {
      subRequestRetryContext.disableLogs();
      expect(subRequestRetryContext.areLogsEnabled()).toBe(false);
    });
  });

  describe('getRequestData', () => {
    it('should correctly return SubRequestRetryData', () => {
      const response = new Response('', { status: 200 });
      subRequestRetryContext.setResponse(response);

      const subRequestRetryData: SubRequestRetryData = subRequestRetryContext.getRequestData();
      const metaData = subRequestRetryData.getMetaData();
      expect(subRequestRetryData.getId()).toBe(
        `${subRequestRetryContext.getAccountId()}/${subRequestRetryContext.getRequestId()}/${subRequestRetryContext.getSubRequestId()}/${subRequestRetryContext.getId()}`,
      );
      expect(subRequestRetryData.getRequest()).toContain(subRequestRetryContext.getRequest());
      expect(subRequestRetryData.getResponse()).toContain(subRequestRetryContext.getResponse());
      expect(subRequestRetryData.getError()).toBe(null);
      expect(metaData.id).toBe(subRequestRetryContext.getId());
      expect(metaData.requestId).toBe(subRequestRetryContext.getRequestId());
      expect(metaData.subRequestId).toBe(subRequestRetryContext.getSubRequestId());
      expect(metaData.url).toBe(subRequestRetryContext.getRequest().url);
      expect(metaData.method).toBe(subRequestRetryContext.getRequest().method);
      expect(metaData.status).toBe(subRequestRetryContext.getResponse()!.status);
      expect(metaData.success).toBe(subRequestRetryContext.getResponse()!.ok);
      expect(metaData.duration).toBeDefined();
    });

    it('should throw error due to missing response', async () => {
      const responseCallback = async (): Promise<SubRequestRetryData> => {
        return subRequestRetryContext.getRequestData();
      };

      await expect(responseCallback).rejects.toThrowError(Error);
    });
  });
});
