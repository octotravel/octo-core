import { describe, expect, it } from 'vitest';
import { SubRequestRetryDataDataProvider } from './dataProviders/SubRequestRetryDataDataProvider';

describe('SubRequestRetryContext', () => {
  describe('constructor', () => {
    it('should correctly initialize class properties', async () => {
      const dataProvider = new SubRequestRetryDataDataProvider();
      const subRequestRetryData = dataProvider.data;

      expect(subRequestRetryData.getId()).toEqual(dataProvider.id);
      expect(JSON.stringify(subRequestRetryData.getRequest())).toBe(JSON.stringify(dataProvider.request));
      expect(JSON.stringify(subRequestRetryData.getResponse())).toBe(JSON.stringify(dataProvider.response));
      expect(JSON.stringify(subRequestRetryData.getError())).toBe(JSON.stringify(dataProvider.error));
      expect(subRequestRetryData.getMetaData()).toEqual(dataProvider.metaData);
      expect(subRequestRetryData.areLogsEnabled()).toEqual(dataProvider.logsEnabled);

      await subRequestRetryData.getRequest().text();
      await subRequestRetryData.getResponse().text();
    });
  });
});
