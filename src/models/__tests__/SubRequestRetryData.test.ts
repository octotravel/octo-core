import { describe, expect, it } from 'vitest';
import { SubRequestRetryDataDataProvider } from './dataProviders/SubRequestRetryDataDataProvider';

describe('SubRequestRetryContext', () => {
  describe('constructor', () => {
    it('should correctly initialize class properties', async () => {
      const dataProvider = new SubRequestRetryDataDataProvider();
      const subRequestRetryData = dataProvider.data;

      expect(subRequestRetryData.getId()).toEqual(dataProvider.id);
      expect(subRequestRetryData.getRequest()).toContain(dataProvider.request);
      expect(subRequestRetryData.getResponse()).toContain(dataProvider.response);
      expect(subRequestRetryData.getError()).toContain(dataProvider.error);
      expect(subRequestRetryData.getMetaData()).toEqual(dataProvider.metaData);
      expect(subRequestRetryData.areLogsEnabled()).toEqual(dataProvider.logsEnabled);

      await dataProvider.request.text();
      await dataProvider.response.text();

      await subRequestRetryData.getRequest().text();
      await subRequestRetryData.getResponse().text();
    });
  });
});
