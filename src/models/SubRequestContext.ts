import { v4 as uuid } from 'uuid';
import { RequestMethod } from '../types/Request';
import { DateHelper } from './DateHelper';
import { RuntimeError } from './Error';

export class SubRequestContext {
  private readonly parentRequestId: string;
  private readonly requestId: string;
  private readonly startDate: Date;
  private endDate: Date | null = null;

  private requestMethod: string | undefined;
  private requestUrl: string | undefined;
  private requestHeaders: Record<string, string> = {};
  private requestBody: string | undefined;

  private responseHeaders: Record<string, string> = {};
  private responseBody: string | undefined;
  private responseStatus: number | undefined;

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

  public setRequestMethod(requestMethod: RequestMethod | string): void {
    this.requestMethod = requestMethod;
  }

  public getRequestMethod(): string {
    if (this.requestMethod === undefined) {
      throw new RuntimeError('requestMethod is not set');
    }

    return this.requestMethod;
  }

  public setRequestUrl(requestUrl: string): void {
    this.requestUrl = requestUrl;
  }

  public getRequestUrl(): string {
    if (this.requestUrl === undefined) {
      throw new RuntimeError('requestUrl is not set');
    }

    return this.requestUrl;
  }

  public setRequestHeaders(requestHeaders: Record<string, string>): void {
    this.requestHeaders = requestHeaders;
  }

  public getRequestHeaders(): Record<string, string> {
    return this.requestHeaders;
  }

  public setRequestBody(requestBody: string | undefined): void {
    this.requestBody = requestBody;
  }

  public getRequestBody(): string | undefined {
    return this.requestBody;
  }

  public setResponseHeaders(responseHeaders: Record<string, string>): void {
    this.responseHeaders = responseHeaders;
  }

  public getResponseHeaders(): Record<string, string> {
    return this.responseHeaders;
  }

  public setResponseBody(responseBody: string | undefined): void {
    this.responseBody = responseBody;
  }

  public getResponseBody(): string {
    if (this.responseBody === undefined) {
      throw new RuntimeError('responseBody is not set.');
    }

    return this.responseBody;
  }

  public setResponseStatus(responseStatus: number | undefined): void {
    this.responseStatus = responseStatus;
  }

  public getResponseStatus(): number {
    if (this.responseStatus === undefined) {
      throw new RuntimeError('responseStatus is not set.');
    }

    return this.responseStatus;
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
