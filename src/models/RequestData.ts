import { BaseRequestData, IBaseRequestData } from './BaseRequestData';
import { Environment } from './Config';
import { SubRequestData } from './SubRequestData';

export interface ConnectionMetaData {
  id: string | null;
  channel: string | null;
  name: string | null;
  endpoint: string | null;
  account: string | null;
  environment: Environment;
}

export interface RequestMetaData {
  id: string;
  date: Date;
  connection: ConnectionMetaData;
  action: string;
  status: number;
  success: boolean;
  duration: number;
  environment: Environment;
}

export class RequestData extends BaseRequestData implements IBaseRequestData {
  public id: string;
  public request: Request;
  public response: Response;
  public metadata: RequestMetaData;
  public error: Error | null = null;
  public logsEnabled: boolean;
  public subrequests: SubRequestData[] = [];
  public productIds: string[] = [];

  public constructor({
    id,
    request,
    response,
    error,
    metadata,
    logsEnabled,
    subrequests,
    productIds,
  }: {
    id: string;
    request: Request;
    response: Response;
    error: Error | null;
    metadata: RequestMetaData;
    logsEnabled: boolean;
    subrequests: SubRequestData[];
    productIds: string[];
  }) {
    super();
    this.id = id;
    this.request = request;
    this.response = response;
    this.error = error;
    this.metadata = metadata;
    this.logsEnabled = logsEnabled;
    this.subrequests = subrequests;
    this.productIds = productIds;
  }
}
