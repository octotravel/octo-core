import { addSeconds } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { DataGenerationService } from '../../services/DataGenerationService';
import { AlertData } from '../AlertData';
import { Environment } from '../Config';
import { RequestContext } from '../RequestContext';
import { RequestData } from '../RequestData';
import { RequestDataDataProvider } from './dataProviders/RequestDataDataProvider';

describe('RequestContext', () => {
  let requestContext: RequestContext;
  let requestDataDataProvider: RequestDataDataProvider;
  const dataGenerationService = new DataGenerationService();
  const accountId = dataGenerationService.generateUUID();
  const connectionId = dataGenerationService.generateUUID();
  const connection = {
    id: connectionId,
    supplierId: 'supplierId',
    apiKey: 'apiKey',
    endpoint: 'endpoint',
    accountId,
    name: 'name',
  };
  const channel = 'testChannel';
  const action = 'testAction';
  const productIds = [dataGenerationService.generateUUID()];

  beforeEach(() => {
    requestDataDataProvider = new RequestDataDataProvider();
    requestContext = new RequestContext({
      request: requestDataDataProvider.request,
    });

    requestContext.addSubrequest(requestDataDataProvider.subRequestDataProvider.data);
  });

  describe('constructor', () => {
    it('should correctly initialize and set class properties', () => {
      requestContext.setConnection(connection);
      requestContext.setAccountId(accountId);
      requestContext.setChannel(channel);
      requestContext.setAction(action);
      requestContext.setProductIds(productIds);
      requestContext.setResponse(requestDataDataProvider.response);
      requestContext.setError(requestDataDataProvider.error);

      expect(requestContext.getRequestId()).toBeDefined();
      expect(JSON.stringify(requestContext.getRequest())).toBe(JSON.stringify(requestDataDataProvider.request));
      expect(JSON.stringify(requestContext.getResponse())).toBe(JSON.stringify(requestDataDataProvider.response));
      expect(JSON.stringify(requestContext.getError())).toBe(JSON.stringify(requestDataDataProvider.error));
      expect(requestContext.getConnection()).toBe(connection);
      expect(requestContext.getAccountId()).toBe(accountId);
      expect(requestContext.getChannel()).toBe(channel);
      expect(requestContext.getAction()).toBe(action);
      expect(requestContext.getProductIds()).toBe(productIds);
      expect(requestContext.areLogsEnabled()).toBe(true);
      expect(requestContext.isRequestImportant()).toBe(false);
      expect(requestContext.areCorsEnabled()).toBe(false);
      expect(requestContext.isAlertEnabled()).toBe(false);
    });
  });

  describe('getResponse', () => {
    it('should return null response', () => {
      expect(requestContext.getResponse()).toEqual(null);
    });
  });

  describe('getConnection', () => {
    it('should throw error due to unset connection', async () => {
      const getConnection = (): void => {
        requestContext.getConnection();
      };

      expect(getConnection).toThrowError('connection is not set');
    });
  });

  describe('getAccountId', () => {
    it('should throw error due to unset accountId', async () => {
      const getAccountId = (): void => {
        requestContext.getAccountId();
      };

      expect(getAccountId).toThrowError('accountId is not set');
    });
  });

  describe('getChannel', () => {
    it('should throw error due to unset channel', async () => {
      const getChannel = (): void => {
        requestContext.getChannel();
      };

      expect(getChannel).toThrowError('channel is not set');
    });
  });

  describe('getSubRequests', () => {
    it('should get sub requests', () => {
      expect(requestContext.getSubRequests().length).toBe(1);
      expect(requestContext.getSubRequests()[0]).toBe(requestDataDataProvider.subRequestDataProvider.data);
    });
  });

  describe('enableLogs', () => {
    it('should enable logs', () => {
      requestContext.enableLogs();
      expect(requestContext.areLogsEnabled()).toBe(true);
    });
  });

  describe('disableLogs', () => {
    it('should disable logs', () => {
      requestContext.disableLogs();
      expect(requestContext.areLogsEnabled()).toBe(false);
    });
  });

  describe('setRequestAsImportant', () => {
    it('should set request as important', () => {
      requestContext.setRequestAsImportant();
      expect(requestContext.isRequestImportant()).toBe(true);
    });
  });

  describe('setRedirectURL', () => {
    it('should get redirect url', () => {
      expect(requestContext.redirectURL).toBe(null);
    });
    it('should set redirect url', () => {
      requestContext.setRedirectURL('https://example.com');
      expect(requestContext.redirectURL).toBe('https://example.com');
    });
  });

  describe('enableCors', () => {
    it('should enable cors', () => {
      requestContext.enableCors();
      expect(requestContext.areCorsEnabled()).toBe(true);
    });
  });

  describe('enableAlert', () => {
    it('should enable alert', () => {
      const alertData = new AlertData('GENERAL', 'Test Alert');
      requestContext.enableAlert(alertData);
      expect(requestContext.isAlertEnabled()).toBe(true);
      expect(requestContext.getAlertData()).toBe(alertData);
    });
  });

  describe('disableAlert', () => {
    it('should disable alert', () => {
      requestContext.disableAlert();
      expect(requestContext.isAlertEnabled()).toBe(false);
    });
  });

  describe('getRequestDuration', () => {
    it('should return duration', () => {
      const date = addSeconds(requestContext.getDate(), 1);
      expect(requestContext.getRequestDuration(date)).toBe(1);
    });
  });

  describe('getRequestDurationInMs', () => {
    it('should return duration in ms', () => {
      const date = addSeconds(requestContext.getDate(), 1);
      expect(requestContext.getRequestDurationInMs(date)).toBe(1000);
    });
  });

  describe('getRequestData', () => {
    it('should correctly return RequestData', () => {
      requestContext.setConnection(connection);
      requestContext.setAccountId(accountId);
      requestContext.setChannel(channel);
      requestContext.setAction(action);
      requestContext.setProductIds(productIds);
      requestContext.setResponse(requestDataDataProvider.response);
      requestContext.setError(requestDataDataProvider.error);

      const requestData: RequestData = requestContext.getRequestData();
      expect(requestData.getId()).toBe(`${requestContext.getAccountId()}/${requestContext.getRequestId()}`);
      expect(JSON.stringify(requestData.getRequest())).toBe(JSON.stringify(requestContext.getRequest()));
      expect(JSON.stringify(requestData.getResponse())).toBe(JSON.stringify(requestContext.getResponse()));
      expect(requestData.getError()).toBe(requestContext.getError());
      expect(requestData.areLogsEnabled()).toBe(requestContext.areLogsEnabled());
      expect(requestData.getProductIds()).toBe(requestContext.getProductIds());

      const metaData = requestData.getMetaData();
      expect(metaData.id).toBe(requestContext.getRequestId());
      expect(metaData.connection.id).toBe(requestContext.getConnection().id);
      expect(metaData.connection.channel).toBe(requestContext.getChannel());
      expect(metaData.connection.endpoint).toBe(requestContext.getConnection().endpoint);
      expect(metaData.connection.account).toBe(requestContext.getConnection().accountId);
      expect(metaData.connection.environment).toBe(requestContext.getEnvironment());
      expect(metaData.action).toBe(requestContext.getAction());
      expect(metaData.url).toBe(requestContext.getRequest().url);
      expect(metaData.method).toBe(requestContext.getRequest().method);
      expect(metaData.status).toBe(requestContext.getResponse()!.status);
      expect(metaData.success).toBe(requestContext.getResponse()!.ok);
      expect(metaData.duration).toBeDefined();
      expect(metaData.environment).toBe(Environment.LOCAL);
    });

    it('should throw error due to missing response', async () => {
      const responseCallback = async (): Promise<RequestData> => {
        return requestContext.getRequestData();
      };

      await expect(responseCallback).rejects.toThrowError(Error);
    });
  });
});
