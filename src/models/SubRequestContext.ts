import { v4 as uuid } from 'uuid';
import { DateHelper } from './DateHelper';
import { RuntimeError } from './Error';

export class SubRequestContext {
  private readonly parentRequestId: string;
  private readonly requestId: string;
  private readonly startDate: Date;
  private endDate: Date | null = null;

  private request: Request | null = null;
  private response: Response | null = null;

  private error: Error | null = null;

  private readonly subRequestRetries: SubRequestContext[] = [];

  public static Create({
    parentRequestId,
    requestId = undefined,
  }: {
    parentRequestId: string;
    requestId?: string | undefined;
  }): SubRequestContext {
    return new SubRequestContext({
      parentRequestId,
      requestId: requestId ?? uuid(),
      startDate: new Date(),
    });
  }

  private constructor({
    parentRequestId,
    requestId,
    startDate,
  }: {
    parentRequestId: string;
    requestId: string;
    startDate: Date;
  }) {
    this.parentRequestId = parentRequestId;
    this.requestId = requestId;
    this.startDate = startDate;
  }

  public getParentRequestId(): string {
    return this.parentRequestId;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public setEndDate(endDate: Date): void {
    if (this.endDate !== null) {
      throw new RuntimeError('endDate is already set');
    }

    if (endDate.getTime() < this.startDate.getTime()) {
      throw new RuntimeError('endDate cannot be before startDate');
    }

    this.endDate = endDate;
  }

  public getEndDate(): Date | null {
    return this.endDate;
  }

  public getRequest(): Request | null {
    if (this.request === null) {
      throw new RuntimeError('request is not set');
    }

    return this.request;
  }

  public setRequest(request: Request | null): void {
    this.request = request;
  }

  public getResponse = (): Response | null => {
    if (this.response === null) {
      throw new RuntimeError('response is not set');
    }
    return this.response;
  };

  public setResponse(response: Response | null): void {
    this.response = response;
  }

  public setError(error: Error | null): void {
    this.error = error;
  }

  public getError(): Error | null {
    return this.error;
  }

  public addSubRequestRetry(subRequestContext: SubRequestContext): void {
    this.subRequestRetries.push(subRequestContext);
  }

  public getSubRequestRetries(): SubRequestContext[] {
    return this.subRequestRetries;
  }

  public getRequestDuration(): number {
    if (this.endDate === null) {
      throw new RuntimeError('endDate is not set');
    }

    return (this.endDate.getTime() - this.startDate.getTime()) / 1000;
  }

  public getRequestDurationInMs(): number {
    if (this.endDate === null) {
      throw new RuntimeError('endDate is not set');
    }

    return DateHelper.toPositiveMs(this.endDate.getTime() - this.startDate.getTime());
  }

  public getRequestDurationForDateInMs(date: Date): number {
    return DateHelper.toPositiveMs(date.getTime() - this.startDate.getTime());
  }
}
