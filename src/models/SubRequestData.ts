import { BaseRequestData } from './BaseRequestData';
import { SubRequestRetryData } from './SubRequestRetryData';

export interface SubrequestMetaData {
  id: string;
  requestId: string;
  date: Date;
  url: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
}

export class SubRequestData implements BaseRequestData<SubrequestMetaData> {
  private readonly id: string;
  private readonly request: Request;
  private readonly response: Response;
  private readonly retries: SubRequestRetryData[] = [];
  private readonly error: Error | null = null;
  private readonly metaData: SubrequestMetaData;
  private readonly logsEnabled: boolean;

  public constructor({
    id,
    request,
    response,
    retries,
    error,
    metaData,
    logsEnabled,
  }: {
    id: string;
    request: Request;
    response: Response;
    error: Error | null;
    retries: SubRequestRetryData[];
    metaData: SubrequestMetaData;
    logsEnabled: boolean;
  }) {
    this.id = id;
    this.response = response.clone();
    this.request = request.clone();
    this.retries = retries;
    this.error = error;
    this.metaData = metaData;
    this.logsEnabled = logsEnabled;
  }

  public getFinalResponse(): Response {
    if (this.retries.length > 0) {
      return this.retries[this.getRetries().length - 1].getResponse();
    }

    return this.response;
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

  public getRetries(): SubRequestRetryData[] {
    return this.retries;
  }

  public getMetaData(): SubrequestMetaData {
    return this.metaData;
  }

  public areLogsEnabled(): boolean {
    return this.logsEnabled;
  }
}
