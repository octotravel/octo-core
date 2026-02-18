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
  private endDate: Date | null = null;

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
    this.request = request.clone();
    this.accountId = accountId;
    this.requestId = requestId;
    this.subRequestId = subRequestId;
    this.startDate = new Date();
  }

  public getRequest(): Request {
    return this.request;
  }

  public setResponse(response: Response | null): void {
    if (response !== null) {
      this.response = response.clone();
    } else {
      this.response = null;
    }
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

  public getStartDate(): Date {
    return this.startDate;
  }

  public setEndDate(endDate: Date): void {
    if (this.endDate !== null) {
      throw new Error('endDate is already set');
    }

    if (endDate < this.startDate) {
      throw new Error('endDate cannot be before startDate');
    }

    this.endDate = endDate;
  }

  public getEndDate(): Date | null {
    return this.endDate;
  }

  public getRequestDuration(): number {
    if (this.endDate === null) {
      throw new Error('endDate is not set');
    }

    return this.getDuration(this.startDate, this.endDate);
  }

  private getDuration(startDate: Date, endDate: Date): number {
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }

  public getRequestDurationInMs(): number {
    const milliseconds = Math.ceil(this.getRequestDuration() * 1000);
    return milliseconds < 1 ? 1 : milliseconds;
  }

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
      duration: this.getRequestDuration(),
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
