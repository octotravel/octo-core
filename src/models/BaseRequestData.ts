import { BaseRequestMetaData } from './BaseRequestMetaData';

export interface BaseRequestData<MetaData extends BaseRequestMetaData> {
  getId: () => string;
  getRequest: () => Request;
  getResponse: () => Response;
  getError: () => Error | null;
  getMetaData: () => MetaData;
  areLogsEnabled: () => boolean;
}
