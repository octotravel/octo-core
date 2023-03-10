import { BaseConnection } from "../types/Connection";
import { ConnectionMetaData, RequestData, RequestMetaData } from "./RequestData";
import { SubRequestData } from "./SubRequestData";
import { DataGenerationService } from "../services/DataGenerationService";
import { HttpError } from "./Error";
import { BaseConfig } from "./Config";

export class RequestContext {
  private dataGenerationService = new DataGenerationService();

  private date: Date;
  private connection: BaseConnection | null = null;
  private accountId: string | null = null;
  private request: Request;
  private requestId: string;
  private channel: string;
  private action = "";
  private logsEnabled = true;
  private alertEnabled = false;
  private _corsEnabled = false;
  private subrequests: SubRequestData[] = [];
  private config: BaseConfig;
  private httpError: HttpError | null = null;
  private productIds: string[] = [];

  constructor({
    request,
    connection = null,
    channel,
    accountId,
    config,
  }: {
    request: Request;
    connection: BaseConnection | null;
    channel: string;
    accountId?: string;
    config: BaseConfig;
  }) {
    this.requestId = this.generateRequestId();
    this.request = request;
    this.accountId = connection?.accountId ?? accountId ?? null;
    this.connection = connection;
    this.date = new Date();
    this.channel = channel;
    this.config = config;
  }

  private generateRequestId = (): string => this.dataGenerationService.generateUUID();

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

  public enableCORS = (): void => {
    this._corsEnabled = true;
  };

  public disableLogs = (): void => {
    this.logsEnabled = false;
  };

  public setHttpError = (error: HttpError): void => {
    this.httpError = error;
  };

  public setProductIds = (productIds: string[]): void => {
    this.productIds = productIds;
  };

  public enableAlert = (): void => {
    if (!this.config.isDevelopment) {
      this.alertEnabled = true;
      this.enableLogs();
    }
  };

  public disableAlert = (): void => {
    this.alertEnabled = false;
  };

  public getRequestId = (): string => this.requestId;

  public getChannel = (): string => this.channel;

  public isAlertEnabled = (): boolean => this.alertEnabled;

  public getConnection = <T extends BaseConnection>(): T => {
    if (this.connection === null) {
      throw new Error("connection is not set");
    }
    return this.connection as T;
  };

  public getAccountId = (): string => this.accountId as string;

  public getRequest = (): Request => this.request as Request;

  public getAction = (): string => this.action;

  public getConfig = <T extends BaseConfig>(): T => this.config as T;

  private getDuration = (start: Date, end: Date): number => {
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
    if (this.subrequests.length > 998) {
      throw new Error("maximum subrequest limit reached");
    }
    this.subrequests.push(data);
  };

  public get corsEnabled(): boolean {
    return this._corsEnabled;
  }

  public getRequestData = (response: Response, error?: Error): RequestData => {
    const id = `${this.accountId}/${this.requestId}`;
    const backend = this.connection?.backend;
    const connectionMetaData: ConnectionMetaData = {
      id: this.connection?.id ?? "",
      channel: this.channel,
      name: this.connection?.name ?? "",
      backend: backend?.type ?? "",
      endpoint: backend?.endpoint ?? "",
      account: this.accountId,
      environment: this.config.environment,
    };

    const metadata: RequestMetaData = {
      id: this.requestId ?? "",
      date: this.date,
      connection: connectionMetaData,
      action: this.action,
      status: response.status,
      success: response.ok,
      duration: this.getDuration(this.date, new Date()),
      environment: this.config.environment,
    };

    const requestData = new RequestData({
      id,
      request: this.request,
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
