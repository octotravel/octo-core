import { SubRequestData } from './SubRequestData';
import { DataGenerationService } from '../services/DataGenerationService';
import { SubRequestRetryData } from './SubRequestRetryData';
import { SubMetadata } from './SubMetadata';

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

  private readonly generateRequestId = (): string => this.dataGenerationService.generateUUID();

  public constructor({ request, accountId, requestId }: { request: Request; accountId: string; requestId: string }) {
    this.subRequestId = this.generateRequestId();
    this.accountId = accountId;
    this.requestId = requestId;
    this.request = request;
    this.startDate = new Date();
  }

  public setResponse(response: Response | null): void {
    this.response = response;
  }

  public setError(error: Error | null): void {
    this.error = error;
  }

  public enableLogs(): void {
    this.logsEnabled = true;
  }

  public disableLogs(): void {
    this.logsEnabled = false;
  }

  public addRetry(data: SubRequestRetryData): void {
    this.retries.push(data);
  }

  public getRetries(): SubRequestRetryData[] {
    return this.retries;
  }

  private readonly getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };

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
    if (this.response === null) {
      throw new Error('Response is not set');
    }

    const id = `${this.accountId}/${this.requestId}/${this.subRequestId}`;
    const metadata: SubMetadata = {
      id: this.subRequestId,
      requestId: this.requestId,
      date: this.startDate,
      url: this.request.url,
      method: this.request.method,
      status: this.response.status,
      success: this.response.ok,
      duration: this.getDuration(this.startDate, new Date()),
    };
    const requestData = new SubRequestData({
      id,
      request: this.request,
      response: this.response,
      retries: this.retries,
      error: this.error,
      metadata,
      logsEnabled: this.logsEnabled,
    });

    return requestData;
  }
}
