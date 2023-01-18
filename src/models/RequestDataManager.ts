import { Repository } from "./../types/Repository";
import { BaseConnection } from "../types/Connection";
import {
  ConnectionMetaData,
  RequestData,
  RequestMetaData,
  SubRequestData,
} from "./RequestData";
import { DataGenerationService } from "../services/DataGenerationService";
import { HttpError } from "./Error";
import { Config } from "./Config";
import { Backend } from "../types/Backend";

export class RequestDataManager<Connection, Config> {
  private dataGenerationService = new DataGenerationService();
  private coreConfig = new Config();

  private date: Date;
  private _backend: Backend;
  private _connectionRepository: Repository<Connection>;
  private connection: BaseConnection | null = null;
  private accountId: string | null = null;
  private request: Request;
  private requestId: string;
  private channel: string;
  private action = "";
  private searchKeys: Array<string> = [];
  private logsEnabled = true;
  private alertEnabled = false;
  private _corsEnabled = false;
  private subrequests: SubRequestData[] = [];
  private _config: Config;

  constructor({
    request,
    connection = null,
    channel,
    accountId,
    backend,
    connectionRepository,
    config,
  }: {
    request: Request;
    connection: BaseConnection | null;
    channel: string;
    accountId?: string;
    backend: Backend;
    connectionRepository: Repository<Connection>;
    config: Config,
  }) {
    this.requestId = this.generateRequestId();
    this.request = request;
    this.accountId = connection?.accountId ?? accountId ?? null;
    this.connection = connection;
    this.date = new Date();
    this.channel = channel;
    this._backend = backend;
    this._connectionRepository = connectionRepository;
    this._config = config
  }

  private generateRequestId = (): string =>
    this.dataGenerationService.generateUUID();

  public addSearchKey = (key: string): void => {
    this.searchKeys.push(key);
  };

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

  public enableAlert = (): void => {
    if (!this.coreConfig.isDev) {
      this.alertEnabled = true;
      this.enableLogs();
    }
  };

  public disableAlert = (): void => {
    this.alertEnabled = false;
  };

  public get backend(): Backend {
    return this._backend;
  }

  public get config(): Config {
    return this._config
  }

  public get connectionRepository(): Repository<Connection> {
    return this._connectionRepository;
  }

  public getRequestId = (): string => this.requestId;

  public getChannel = (): string => this.channel;

  public isAlertEnabled = (): boolean => this.alertEnabled;

  public getConnection = (): BaseConnection =>
    this.connection as BaseConnection;

  public getAccountId = (): string => this.accountId as string;

  public getRequest = (): Request => this.request as Request;

  private getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };

  public getRequestDuration = (): number =>
    this.getDuration(this.date, new Date());

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
      environment: this.coreConfig.environment,
    };

    const metadata: RequestMetaData = {
      id: this.requestId ?? "",
      date: this.date,
      connection: connectionMetaData,
      action: this.action,
      status: response.status,
      success: response.ok,
      duration: this.getDuration(this.date, new Date()),
      environment: this.coreConfig.environment,
    };
    const requestData = new RequestData({
      id,
      request: this.request,
      metadata,
      response,
      logsEnabled: this.logsEnabled,
      subrequests: this.subrequests,
    });

    if (error) {
      requestData.setError(error);
      if (error instanceof HttpError) {
        metadata.status = error.statusLog;
        metadata.success = error.statusLog >= 200 && error.statusLog < 300;
      }
    }
    return requestData;
  };
}
