import { BaseRequestData } from './BaseRequestData';
import { BaseRequestMetaData } from './BaseRequestMetaData';

export interface SubrequestRetryMetaData extends BaseRequestMetaData {
  requestId: string;
  subRequestId: string;
}

export class SubRequestRetryData implements BaseRequestData<SubrequestRetryMetaData> {
  private readonly id: string;
  private readonly request: Request;
  private readonly response: Response;
  private readonly error: Error | null = null;
  private readonly metaData: SubrequestRetryMetaData;
  private readonly logsEnabled: boolean;

  public constructor({
    id,
    request,
    response,
    error,
    metaData,
    logsEnabled,
  }: {
    id: string;
    request: Request;
    response: Response;
    error: Error | null;
    metaData: SubrequestRetryMetaData;
    logsEnabled: boolean;
  }) {
    this.id = id;
    this.response = response;
    this.request = request;
    this.error = error;
    this.metaData = metaData;
    this.logsEnabled = logsEnabled;
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

  public getMetaData(): SubrequestRetryMetaData {
    return this.metaData;
  }

  public areLogsEnabled(): boolean {
    return this.logsEnabled;
  }
}
