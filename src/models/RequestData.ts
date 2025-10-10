import { BaseRequestData } from './BaseRequestData';
import { BaseRequestMetaData } from './BaseRequestMetaData';
import { Environment } from './Environment';
import { SubRequestData } from './SubRequestData';

export interface ConnectionMetaData {
  id: string | null;
  channel: string | null;
  name: string | null;
  endpoint: string | null;
  account: string | null;
  environment: Environment;
}

export interface RequestMetaData extends BaseRequestMetaData {
  connection: ConnectionMetaData;
  action: string;
  environment: Environment;
}

export class RequestData implements BaseRequestData<RequestMetaData> {
  private readonly id: string;
  private readonly request: Request;
  private readonly response: Response;
  private readonly metaData: RequestMetaData;
  private readonly error: Error | null = null;
  private readonly subRequests: SubRequestData[] = [];
  private readonly logsEnabled: boolean;
  private readonly productIds: string[] = [];

  public constructor({
    id,
    request,
    response,
    error,
    metaData,
    logsEnabled,
    subRequests,
    productIds,
  }: {
    id: string;
    request: Request;
    response: Response;
    error: Error | null;
    metaData: RequestMetaData;
    logsEnabled: boolean;
    subRequests: SubRequestData[];
    productIds: string[];
  }) {
    this.id = id;
    this.request = request;
    this.response = response;
    this.error = error;
    this.metaData = metaData;
    this.logsEnabled = logsEnabled;
    this.subRequests = subRequests;
    this.productIds = productIds;
  }

  public getId(): string {
    return this.id;
  }

  public getRequest(): Request {
    return this.request;
  }

  public getResponse(): Response {
    return this.response;
  }

  public getError(): Error | null {
    return this.error;
  }

  public getSubRequests(): SubRequestData[] {
    return this.subRequests;
  }

  public getMetaData(): RequestMetaData {
    return this.metaData;
  }

  public areLogsEnabled(): boolean {
    return this.logsEnabled;
  }

  public getProductIds(): string[] {
    return this.productIds;
  }
}
