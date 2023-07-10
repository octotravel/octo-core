import { BaseRequestData, IBaseRequestData } from "./BaseRequestData";
import { Environment } from "./Config";
import { SubRequestData } from "./SubRequestData";

export type ConnectionMetaData = {
  id: string | null;
  channel: string | null;
  name: string | null;
  endpoint: string | null;
  account: string | null;
  environment: Environment;
};

export type RequestMetaData = {
  id: string;
  date: Date;
  connection: ConnectionMetaData;
  action: string;
  status: number;
  success: boolean;
  duration: number;
  environment: Environment;
};

export class RequestData extends BaseRequestData implements IBaseRequestData {
  public id: string;
  public request: Request;
  public response: Response;
  public metadata: RequestMetaData;
  public error: Error | null = null;
  public searchKeys: string[] = [];
  public logsEnabled: boolean;
  public subrequests: SubRequestData[] = [];
  public productIds: string[] = [];

  constructor({
    id,
    request,
    response,
    metadata,
    logsEnabled,
    subrequests,
    productIds,
  }: {
    id: string;
    request: Request;
    response: Response;
    metadata: RequestMetaData;
    logsEnabled: boolean;
    subrequests: SubRequestData[];
    productIds: string[];
  }) {
    super();
    this.id = id;
    this.response = response;
    this.request = request;
    this.metadata = metadata;
    this.logsEnabled = logsEnabled;
    this.subrequests = subrequests;
    this.productIds = productIds;
  }

  public setSearchKeys = (searchKeys: Array<string>): void => {
    this.searchKeys = searchKeys;
  };

  public setError = (error: Error): void => {
    this.error = error;
  };
}
