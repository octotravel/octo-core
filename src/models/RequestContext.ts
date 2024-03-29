import { BaseConnection } from '../types/Connection';
import { ConnectionMetaData, RequestData, RequestMetaData } from './RequestData';
import { SubRequestData } from './SubRequestData';
import { DataGenerationService } from '../services/DataGenerationService';
import { HttpError } from './Error';
import { Environment } from './Config';
import { AlertData } from './AlertData';

export class RequestContext {
  private readonly dataGenerationService = new DataGenerationService();

  private readonly date: Date;
  private connection: BaseConnection | null = null;
  private accountId: string | null = null;
  private readonly request: Request;
  private requestId: string;
  private channel: string | null = null;
  private action = '';
  private logsEnabled = true;
  private _isRequestImportant = false;
  private alertData: AlertData | null = null;
  private _corsEnabled = false;
  private readonly subrequests: SubRequestData[] = [];
  private readonly environment: Environment | null = null;
  private error: Error | null = null;
  private httpError: HttpError | null = null;
  private productIds: string[] = [];

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
    this.requestId = this.generateRequestId();
    this.request = request;
    this.accountId = connection?.accountId ?? accountId ?? null;
    this.connection = connection ?? null;
    this.date = new Date();
    this.channel = channel ?? null;
    this.environment = environment ?? null;
  }

  private readonly generateRequestId = (): string => this.dataGenerationService.generateUUID();

  public setConnection = (connection: BaseConnection): void => {
    this.connection = connection;
  };

  public setRequestId = (requestId: string): void => {
    this.requestId = requestId;
  };

  public setAccountId = (accountId: string): void => {
    this.accountId = accountId;
  };

  public setAction = (action: string): void => {
    this.action = action;
  };

  public enableLogs = (): void => {
    this.logsEnabled = true;
  };

  public setRequestAsImportant = (): void => {
    this._isRequestImportant = true;
  };

  public isRequestImportant = (): boolean => {
    return this._isRequestImportant;
  };

  public enableCORS = (): void => {
    this._corsEnabled = true;
  };

  public disableLogs = (): void => {
    this.logsEnabled = false;
  };

  public getError = (): Error | null => this.error;

  public setError = (error: Error): void => {
    this.error = error;
  };

  public setHttpError = (error: HttpError): void => {
    this.httpError = error;
  };

  public setProductIds = (productIds: string[]): void => {
    this.productIds = productIds;
  };

  public enableAlert = (alertData: AlertData = new AlertData()): void => {
    this.alertData = alertData;
    this.enableLogs();
  };

  public disableAlert = (): void => {
    this.alertData = null;
  };

  public getAlertData = (): AlertData | null => this.alertData;

  public getRequestId = (): string => this.requestId;

  public setChannel = (channel: string): void => {
    this.channel = channel;
  };

  public getChannel = (): string => this.channel!;

  public isAlertEnabled = (): boolean => this.alertData !== null;

  public getConnection = <T extends BaseConnection>(): T => {
    if (this.connection === null) {
      throw new Error('connection is not set');
    }
    return this.connection as T;
  };

  public getAccountId = (): string => this.accountId!;

  public getRequest = (): Request => this.request;

  public getAction = (): string => this.action;

  private readonly getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };

  public getRequestDuration = (): number => this.getDuration(this.date, new Date());

  public getRequestDurationMilliseconds = (): number => {
    const milliseconds = Math.ceil(this.getRequestDuration() * 100);
    if (milliseconds < 1) {
      return 1;
    } else {
      return milliseconds;
    }
  };

  public addSubrequest = (data: SubRequestData): void => {
    this.subrequests.push(data);
  };

  public getSubrequest = (): SubRequestData[] => this.subrequests;

  public get corsEnabled(): boolean {
    return this._corsEnabled;
  }

  public getRequestData = (response: Response, error?: Error): RequestData => {
    const id = `${this.accountId}/${this.requestId}`;
    const connectionMetaData: ConnectionMetaData = {
      id: this.connection?.id ?? null,
      channel: this.channel ?? null,
      name: this.connection?.name ?? null,
      endpoint: this.connection?.endpoint ?? null,
      account: this.accountId,
      environment: this.environment ?? Environment.LOCAL,
    };

    const metadata: RequestMetaData = {
      id: this.requestId ?? '',
      date: this.date,
      connection: connectionMetaData,
      action: this.action,
      status: response.status,
      success: response.ok,
      duration: this.getDuration(this.date, new Date()),
      environment: this.environment ?? Environment.LOCAL,
    };

    const requestData = new RequestData({
      id,
      request: this.getRequest(),
      metadata,
      response,
      logsEnabled: this.logsEnabled,
      subrequests: this.subrequests,
      productIds: this.productIds,
    });

    const err = this.httpError ?? error;

    if (err) {
      requestData.setError(err);
      if (err instanceof HttpError) {
        metadata.status = err.statusLog;
        metadata.success = err.statusLog >= 200 && err.statusLog < 300;
      }
    }

    return requestData;
  };
}
