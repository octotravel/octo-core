import { v4 as uuid } from 'uuid';
import { BaseConnection } from '../types/Connection';
import { RequestMethod } from '../types/Request';
import { AlertData } from './AlertData';
import { DateHelper } from './DateHelper';
import { Environment } from './Environment';
import { RuntimeError } from './Error';
import { SubRequestContext } from './SubRequestContext';

export class RequestContext {
  private environment: Environment;
  private readonly startDate: Date;
  private endDate: Date | null = null;

  private requestId: string;
  private requestMethod: string | undefined;
  private requestUrl: string | undefined;
  private requestHeaders: Record<string, string> = {};
  private requestBody: string | undefined;
  private responseHeaders: Record<string, string> = {};
  private responseBody: string | undefined;
  private responseStatus: number | undefined;
  private error: Error | null = null;

  private service: string | null = null;
  private action = '';
  private connection: BaseConnection | null = null;

  private redirectUrl: string | null = null;
  private logsEnabled = true;
  private alertData: AlertData | null = null;
  private readonly subRequests: SubRequestContext[] = [];

  public static Create(environment: Environment): RequestContext {
    return new RequestContext({
      requestId: uuid(),
      environment,
      startDate: new Date(),
    });
  }

  public static CreateForOcto(environment: Environment) {
    const requestContext = RequestContext.Create(environment);
    requestContext.setRequestMethod(RequestMethod.Get);
    requestContext.setRequestUrl('https://octo.ventrata.com');
  }

  public constructor({
    environment,
    requestId,
    startDate,
  }: {
    environment: Environment;
    requestId: string;
    startDate: Date;
  }) {
    this.environment = environment;
    this.requestId = requestId;
    this.startDate = startDate;
  }

  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public setRequestMethod(requestMethod: string): void {
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

  public getResponseBody(): string | undefined {
    if (this.responseBody === undefined) {
      throw new RuntimeError('responseBody is not set');
    }

    return this.responseBody;
  }

  public setResponseStatus(responseStatus: number | undefined): void {
    this.responseStatus = responseStatus;
  }

  public getResponseStatus(): number {
    if (this.responseStatus === undefined) {
      throw new RuntimeError('responseStatus is not set');
    }

    return this.responseStatus;
  }

  public getConnection = <T extends BaseConnection>(): T => {
    if (this.connection === null) {
      throw new RuntimeError('connection is not set');
    }

    return this.connection as T;
  };

  public setConnection = (connection: BaseConnection): void => {
    this.connection = connection;
  };

  public setService(channel: string): void {
    this.service = channel;
  }

  public getService(): string {
    if (this.service === null) {
      throw new RuntimeError('service is not set');
    }

    return this.service;
  }

  public setAction(action: string): void {
    this.action = action;
  }

  public getAction(): string {
    return this.action;
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

  public setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  public getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  public enableAlert(alertData: AlertData = new AlertData()): void {
    if (this.alertData === null) {
      this.alertData = alertData;
    }
    this.enableLogs();
  }

  public disableAlert(): void {
    this.alertData = null;
  }

  public isAlertEnabled(): boolean {
    return this.alertData !== null;
  }

  public getAlertData(): AlertData | null {
    return this.alertData;
  }

  public getError(): Error | null {
    return this.error;
  }

  public setError(error: Error | null): void {
    this.error = error;
  }

  public getEnvironment(): Environment {
    return this.environment;
  }

  public setEnvironment(environment: Environment): void {
    this.environment = environment;
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

  public addSubrequest(subRequestContext: SubRequestContext): void {
    this.subRequests.push(subRequestContext);
  }

  public getSubRequests(): SubRequestContext[] {
    return this.subRequests;
  }
}
