import { describe, expect, it } from 'vitest';
import { RequestDataDataProvider } from './dataProviders/RequestDataDataProvider';

describe('RequestData', () => {
  describe('constructor', () => {
    it('should correctly initialize class properties', async () => {
      const dataProvider = new RequestDataDataProvider();
      const requestData = dataProvider.data;

      expect(requestData.getId()).toEqual(dataProvider.id);
      expect(JSON.stringify(requestData.getRequest())).toBe(JSON.stringify(dataProvider.request));
      expect(JSON.stringify(requestData.getResponse())).toBe(JSON.stringify(dataProvider.response));
      expect(requestData.getError()).toEqual(dataProvider.error);
      expect(requestData.getMetaData()).toEqual(dataProvider.metaData);
      expect(requestData.getSubRequests().length).toEqual(1);
      expect(JSON.stringify(requestData.getSubRequests()[0])).toBe(
        JSON.stringify(dataProvider.subRequestDataProvider.data),
      );
      expect(requestData.areLogsEnabled()).toEqual(dataProvider.logsEnabled);
      expect(requestData.getProductIds()).toEqual(dataProvider.productIds);

      await requestData.getRequest().text();
      await requestData.getResponse().text();

      for (const subRequestData of requestData.getSubRequests()) {
        await subRequestData.getRequest().text();
        await subRequestData.getResponse().text();

        for (const subRequestRetryData of subRequestData.getRetries()) {
          await subRequestRetryData.getRequest().text();
          await subRequestRetryData.getResponse().text();
        }
      }
    });
  });
});
