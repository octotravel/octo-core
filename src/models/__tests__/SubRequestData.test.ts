import { describe, expect, it } from 'vitest';
import { SubRequestData } from '../SubRequestData';
import { SubRequestDataDataProvider } from './dataProviders/SubRequestDataDataProvider';

describe('SubRequestData', () => {
  describe('constructor', () => {
    it('should correctly initialize class properties', async () => {
      const dataProvider = new SubRequestDataDataProvider();
      const subRequestData = dataProvider.data;

      expect(subRequestData.getId()).toEqual(dataProvider.id);
      expect(JSON.stringify(subRequestData.getRequest())).toBe(JSON.stringify(dataProvider.request));
      expect(JSON.stringify(subRequestData.getResponse())).toBe(JSON.stringify(dataProvider.response));
      expect(JSON.stringify(subRequestData.getFinalResponse())).toBe(
        JSON.stringify(dataProvider.subRequestRetryDataProvider.data.getResponse()),
      );
      expect(subRequestData.getError()).toEqual(dataProvider.error);
      expect(subRequestData.getMetaData()).toEqual(dataProvider.metaData);
      expect(subRequestData.getRetries().length).toEqual(1);
      expect(JSON.stringify(subRequestData.getRetries()[0])).toBe(
        JSON.stringify(dataProvider.subRequestRetryDataProvider.data),
      );
      expect(subRequestData.areLogsEnabled()).toEqual(dataProvider.logsEnabled);

      await subRequestData.getRequest().text();
      await subRequestData.getResponse().text();

      for (const subRequestRetryData of subRequestData.getRetries()) {
        await subRequestRetryData.getRequest().text();
        await subRequestRetryData.getResponse().text();
      }
    });
  });

  describe('getFinalResponse', () => {
    it('should return same response as with getResponse', async () => {
      const dataProvider = new SubRequestDataDataProvider();
      const subRequestData = new SubRequestData({
        id: dataProvider.id,
        request: dataProvider.request,
        response: dataProvider.response,
        error: dataProvider.error,
        metaData: dataProvider.metaData,
        logsEnabled: dataProvider.logsEnabled,
        retries: [],
      });

      expect(JSON.stringify(subRequestData.getFinalResponse())).toBe(
        JSON.stringify(dataProvider.subRequestRetryDataProvider.data.getResponse()),
      );
    });
  });
});
