export interface BaseRequestData<MetaData> {
  getId: () => string;
  getRequest: () => Request;
  getResponse: () => Response;
  getError: () => Error | null;
  getMetaData: () => MetaData;
  areLogsEnabled: () => boolean;
}
