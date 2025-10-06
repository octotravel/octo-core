import { DataGenerationService } from '../services/DataGenerationService';
import { BaseConnection } from '../types/Connection';
import { AlertData } from './AlertData';
import { Environment } from './Config';
import { LogicError } from './Error';
import { ConnectionMetaData, RequestData, RequestMetaData } from './RequestData';
import { SubRequestData } from './SubRequestData';

export class RequestContext {
  private readonly dataGenerationService = new DataGenerationService();

  private readonly request: Request;
  private requestId: string;
  private response: Response | null = null;
  private readonly date: Date;
  private connection: BaseConnection | null = null;
  private accountId: string | null = null;
  private channel: string | null = null;
  private action = '';
  private logsEnabled = true;
  private _isRequestImportant = false;
  private alertData: AlertData | null = null;
  private corsEnabled = false;
  private readonly subRequests: SubRequestData[] = [];
  private readonly environment: Environment;
  private productIds: string[] = [];
  private error: Error | null = null;
  private _redirectURL: string | null = null;

  public constructor({
    request,
    connection = null,
    channel,
    accountId,
    environment,
  }: {
    request: Request;
    connection?: BaseConnection | null;
    channel?: string;
    accountId?: string;
    environment?: Environment;
  }) {
    if (request.bodyUsed) {
      throw new LogicError('Request body is already used');
    }

    this.requestId = this.dataGenerationService.generateUUID();
    this.request = request.clone();
    this.date = new Date();
    this.accountId = connection?.accountId ?? accountId ?? null;
    this.connection = connection ?? null;
    this.channel = channel ?? null;
    this.environment = environment ?? Environment.LOCAL;
  }

  public getRequest = (): Request => {
    return this.request;
  };

  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public getResponse = (): Response | null => {
    return this.response;
  };

  public setResponse(response: Response | null): void {
    if (response?.bodyUsed) {
      throw new LogicError('Response body is already used');
    }

    this.response = response?.clone() ?? null;
  }

  public getConnection = <T extends BaseConnection>(): T => {
    if (this.connection === null) {
      throw new Error('connection is not set');
    }

    return this.connection as T;
  };

  public setConnection = (connection: BaseConnection): void => {
    this.connection = connection;
  };

  public getAccountId(): string {
    if (this.accountId === null) {
      throw new Error('accountId is not set');
    }

    return this.accountId;
  }

  public setAccountId = (accountId: string): void => {
    this.accountId = accountId;
  };

  public setChannel(channel: string): void {
    this.channel = channel;
  }

  public getChannel(): string {
    if (this.channel === null) {
      throw new Error('channel is not set');
    }

    return this.channel;
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

  public setRequestAsImportant(): void {
    this._isRequestImportant = true;
  }

  public isRequestImportant = (): boolean => {
    return this._isRequestImportant;
  };

  public setRedirectURL(url: string): void {
    this._redirectURL = url;
  }

  public get redirectURL(): string | null {
    return this._redirectURL;
  }

  public enableCors(): void {
    this.corsEnabled = true;
  }

  public areCorsEnabled(): boolean {
    return this.corsEnabled;
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

  public getError = (): Error | null => this.error;

  public setError = (error: Error | null): void => {
    this.error = error;
  };

  public setProductIds = (productIds: string[]): void => {
    this.productIds = productIds;
  };

  public getProductIds(): string[] {
    return this.productIds;
  }

  public getEnvironment(): Environment {
    return this.environment;
  }

  private getDuration(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / 1000;
  }

  public getDate(): Date {
    return new Date(this.date.getTime());
  }

  public getRequestDuration(date: Date): number {
    return this.getDuration(this.date, date);
  }

  public getRequestDurationInMs(date: Date): number {
    const milliseconds = Math.ceil(this.getRequestDuration(date) * 1000);
    if (milliseconds < 1) {
      return 1;
    } else {
      return milliseconds;
    }
  }

  public addSubrequest(data: SubRequestData): void {
    this.subRequests.push(data);
  }

  public getSubRequests(): SubRequestData[] {
    return this.subRequests;
  }

  public getRequestData = (): RequestData => {
    const reponse = this.getResponse();

    if (reponse === null) {
      throw new Error('Response is not set');
    }

    const id = `${this.accountId}/${this.requestId}`;
    const connectionMetaData: ConnectionMetaData = {
      id: this.connection?.id ?? null,
      channel: this.channel ?? null,
      name: this.connection?.name ?? null,
      endpoint: this.connection?.endpoint ?? null,
      account: this.accountId,
      environment: this.environment,
    };

    const metaData: RequestMetaData = {
      id: this.getRequestId(),
      date: this.date,
      connection: connectionMetaData,
      action: this.getAction(),
      url: this.getRequest().url,
      method: this.getRequest().method,
      status: reponse.status,
      success: reponse.ok,
      duration: this.getDuration(this.date, new Date()),
      environment: this.environment,
    };

    const requestData = new RequestData({
      id,
      request: this.getRequest(),
      metaData,
      response: this.getResponse()!,
      error: this.error,
      logsEnabled: this.logsEnabled,
      subRequests: this.subRequests,
      productIds: this.productIds,
    });

    return requestData;
  };
}
