import { beforeEach, describe, expect, it } from 'vitest';
import { SubRequestContext } from '../SubRequestContext';
import { SubRequestData } from '../SubRequestData';
import { SubRequestDataDataProvider } from './dataProviders/SubRequestDataDataProvider';

describe('SubRequestContext', () => {
  let subRequestDataDataProvider: SubRequestDataDataProvider;
  let subRequestContext: SubRequestContext;

  beforeEach(() => {
    subRequestDataDataProvider = new SubRequestDataDataProvider();
    subRequestContext = new SubRequestContext({
      request: subRequestDataDataProvider.request,
      accountId: subRequestDataDataProvider.accountId,
      requestId: subRequestDataDataProvider.requestId,
    });

    subRequestContext.addRetry(subRequestDataDataProvider.subRequestRetryDataProvider.data);
  });

  describe('constructor', () => {
    it('should correctly initialize class properties', () => {
      expect(subRequestContext.getId()).toBeDefined();
      expect(subRequestContext.getRequest()).toContain(subRequestDataDataProvider.request);
      expect(subRequestContext.getAccountId()).toBe(subRequestDataDataProvider.accountId);
      expect(subRequestContext.getRequestId()).toBe(subRequestDataDataProvider.requestId);
    });
  });

  describe('getResponse', () => {
    it('should get null response', () => {
      expect(subRequestContext.getResponse()).toEqual(null);
    });
  });

  describe('setResponse', () => {
    it('should set non null response', () => {
      subRequestContext.setResponse(subRequestDataDataProvider.response);
      expect(subRequestContext.getResponse()).toContain(subRequestDataDataProvider.response);
    });

    it('should set null response', () => {
      const response = null;
      subRequestContext.setResponse(response);
      expect(subRequestContext.getResponse()).toEqual(response);
    });
  });

  describe('setError', () => {
    it('should set error correctly', () => {
      const error = new Error('Test Error');
      subRequestContext.setError(error);
      expect(subRequestContext.getError()).toBe(error);
    });
  });

  describe('getRetries', () => {
    it('should get retries', () => {
      expect(subRequestContext.getRetries().length).toBe(1);
      expect(subRequestContext.getRetries()[0]).toBe(subRequestDataDataProvider.subRequestRetryDataProvider.data);
    });
  });

  describe('enableLogs', () => {
    it('should enable logs', () => {
      subRequestContext.enableLogs();
      expect(subRequestContext.areLogsEnabled()).toBe(true);
    });
  });

  describe('disableLogs', () => {
    it('should disable logs', () => {
      subRequestContext.disableLogs();
      expect(subRequestContext.areLogsEnabled()).toBe(false);
    });
  });

  describe('getRequestData', () => {
    it('should correctly return SubRequestData', () => {
      subRequestContext.setResponse(subRequestDataDataProvider.response);

      const subRequestData: SubRequestData = subRequestContext.getRequestData();
      const metaData = subRequestData.getMetaData();
      expect(subRequestData.getId()).toBe(
        `${subRequestContext.getAccountId()}/${subRequestContext.getRequestId()}/${subRequestContext.getId()}`,
      );
      expect(subRequestData.getRequest()).toContain(subRequestContext.getRequest());
      expect(subRequestData.getResponse()).toContain(subRequestContext.getResponse());
      expect(subRequestData.getError()).toBe(null);
      expect(subRequestData.getRetries().length).toBe(1);
      expect(subRequestData.getRetries()[0]).toBe(subRequestContext.getRetries()[0]);
      expect(metaData.id).toBe(subRequestContext.getId());
      expect(metaData.requestId).toBe(subRequestContext.getRequestId());
      expect(metaData.url).toBe(subRequestContext.getRequest().url);
      expect(metaData.method).toBe(subRequestContext.getRequest().method);
      expect(metaData.status).toBe(subRequestContext.getResponse()!.status);
      expect(metaData.success).toBe(subRequestContext.getResponse()!.ok);
      expect(metaData.duration).toBeDefined();
    });

    it('should throw error due to missing response', async () => {
      const responseCallback = async (): Promise<SubRequestData> => {
        return subRequestContext.getRequestData();
      };

      await expect(responseCallback).rejects.toThrowError(Error);
    });
  });
});
