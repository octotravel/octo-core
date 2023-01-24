import { SubMetadata, SubRequestData } from "./RequestData";
import { DataGenerationService } from "../services/DataGenerationService";

export class SubRequestDataManager {
  private dataGenerationService = new DataGenerationService();

  private accountId: string | null = null;
  private request: Request | null = null;
  private requestId: string | null = null;
  private subRequestId = "";
  private date: Date = new Date();
  private logsEnabled = true;

  private generateRequestId = (): string => this.dataGenerationService.generateUUID();

  public initRequestData = ({
    request,
    accountId,
    requestId,
  }: {
    request: Request;
    accountId: string;
    requestId: string;
  }): void => {
    this.subRequestId = this.generateRequestId();
    this.accountId = accountId ?? this.accountId;
    this.requestId = requestId;
    this.request = request;
    this.date = new Date();
  };

  public enableLogs = (): void => {
    this.logsEnabled = true;
  };

  public disableLogs = (): void => {
    this.logsEnabled = false;
  };

  public getSubRequestId = (): string => this.subRequestId;

  private getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };

  public getRequestData = (response: Response, error?: Error): SubRequestData => {
    const id = `${this.accountId}/${this.requestId}/${this.subRequestId}`;
    const metadata: SubMetadata = {
      id: this.subRequestId,
      requestId: this.requestId as string,
      date: this.date,
      url: this.request?.url ?? "",
      method: this.request?.method ?? "",
      status: response.status,
      success: response.ok,
      duration: this.getDuration(this.date, new Date()),
    };
    const requestData = new SubRequestData({
      id,
      request: this.request as Request,
      response,
      metadata,
      logsEnabled: this.logsEnabled,
    });
    if (error) {
      requestData.setError(error);
    }
    return requestData;
  };
}
