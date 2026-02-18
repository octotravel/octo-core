import { DataGenerationService } from '../services/DataGenerationService';
import { SubRequestData, SubrequestMetaData } from './SubRequestData';
import { SubRequestRetryData } from './SubRequestRetryData';

export class SubRequestContext {
  private readonly dataGenerationService = new DataGenerationService();
  private readonly accountId: string;
  private readonly request: Request;
  private readonly requestId: string;
  private readonly subRequestId: string;
  private readonly startDate: Date = new Date();
  private readonly retries: SubRequestRetryData[] = [];

  private response: Response | null = null;
  private error: Error | null = null;
  private logsEnabled = true;
  private endDate: Date | null = null;

  private readonly generateRequestId = (): string => this.dataGenerationService.generateUUID();

  public constructor({ request, accountId, requestId }: { request: Request; accountId: string; requestId: string }) {
    this.subRequestId = this.generateRequestId();
    this.accountId = accountId;
    this.requestId = requestId;
    this.request = request.clone();
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

  public addRetry(data: SubRequestRetryData): void {
    this.retries.push(data);
  }

  public getRetries(): SubRequestRetryData[] {
    return this.retries;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public  setEndDate(endDate: Date): void {
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

  public getId(): string {
    return this.subRequestId;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public getRequestData(): SubRequestData {
    const response = this.getResponse();

    if (response === null) {
      throw new Error('Response is not set');
    }

    const id = `${this.accountId}/${this.requestId}/${this.subRequestId}`;
    const metaData: SubrequestMetaData = {
      id: this.subRequestId,
      requestId: this.requestId,
      date: this.startDate,
      duration: this.getRequestDuration(),
      url: this.getRequest().url,
      method: this.getRequest().method,
      status: response.status,
      success: response.ok,
    };
    const requestData = new SubRequestData({
      id,
      request: this.getRequest(),
      response,
      retries: this.retries,
      error: this.error,
      metaData,
      logsEnabled: this.logsEnabled,
    });

    return requestData;
  }
}
