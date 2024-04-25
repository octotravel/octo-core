import { DataGenerationService } from '../services/DataGenerationService';
import { SubRequestRetryData, SubrequestRetryMetaData } from './SubRequestRetryData';

export class SubRequestRetryContext {
  private readonly dataGenerationService = new DataGenerationService();
  private readonly request: Request;
  private readonly accountId: string;
  private readonly requestId: string;
  private readonly subRequestId: string;
  private readonly id: string;
  private readonly startDate: Date = new Date();

  private response: Response | null = null;
  private error: Error | null = null;
  private logsEnabled = true;

  private readonly generateRequestId = (): string => this.dataGenerationService.generateUUID();

  public constructor({
    request,
    accountId,
    requestId,
    subRequestId,
  }: {
    request: Request;
    accountId: string;
    requestId: string;
    subRequestId: string;
  }) {
    this.id = this.generateRequestId();
    this.request = request;
    this.accountId = accountId;
    this.requestId = requestId;
    this.subRequestId = subRequestId;
    this.startDate = new Date();
  }

  public getRequest(): Request {
    return this.request;
  }

  public setResponse(response: Response | null): void {
    this.response = response;
  }

  public getResponse(): Response | null {
    return this.response;
  }

  public setError(error: Error | null): void {
    this.error = error;
  }

  public getError(): Error | null {
    return this.error;
  }

  public enableLogs(): void {
    this.logsEnabled = true;
  }

  public disableLogs(): void {
    this.logsEnabled = false;
  }

  public areLogsEnabled(): boolean {
    return this.logsEnabled;
  }

  private readonly getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };

  public getAccountId(): string {
    return this.accountId;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public getSubRequestId(): string {
    return this.subRequestId;
  }

  public getId(): string {
    return this.id;
  }

  public getRequestData(): SubRequestRetryData {
    if (this.response === null || this.response === undefined) {
      throw new Error('Response is not set');
    }

    const id = `${this.accountId}/${this.requestId}/${this.subRequestId}/${this.id}`;
    const metaData: SubrequestRetryMetaData = {
      id: this.id,
      requestId: this.requestId,
      subRequestId: this.subRequestId,
      date: this.startDate,
      url: this.getRequest().url,
      method: this.getRequest().method,
      status: this.response.status,
      success: this.response.ok,
      duration: this.getDuration(this.startDate, new Date()),
    };
    const requestData = new SubRequestRetryData({
      id,
      request: this.getRequest(),
      response: this.getResponse()!,
      error: this.error,
      metaData,
      logsEnabled: this.logsEnabled,
    });

    return requestData;
  }
}
