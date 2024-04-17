import { BaseRequestData } from './BaseRequestData';

export interface SubrequestRetryMetaData {
  id: string;
  requestId: string;
  subRequestId: string;
  date: Date;
  url: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
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
    this.response = response.clone();
    this.request = request.clone();
    this.error = error;
    this.metaData = metaData;
    this.logsEnabled = logsEnabled;
  }

  public getId(): string {
    return this.id;
  }

  public getRequest(): Request {
    return this.request.clone();
  }

  public getResponse(): Response {
    return this.response.clone();
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
