import { BaseRequestData, IBaseRequestData } from './BaseRequestData';
import { SubMetadata } from './SubMetadata';

export class SubRequestRetryData extends BaseRequestData implements IBaseRequestData {
  public id: string;
  public request: Request;
  public response: Response;
  public error: Error | null = null;
  public metadata: SubMetadata;
  public logsEnabled: boolean;

  public constructor({
    id,
    request,
    response,
    error,
    metadata,
    logsEnabled,
  }: {
    id: string;
    request: Request;
    response: Response;
    error: Error | null;
    metadata: SubMetadata;
    logsEnabled: boolean;
  }) {
    super();
    this.id = id;
    this.response = response;
    this.request = request;
    this.error = error;
    this.metadata = metadata;
    this.logsEnabled = logsEnabled;
  }

  public clone = (): SubRequestRetryData => {
    return new SubRequestRetryData({
      id: this.id,
      request: this.request.clone(),
      response: this.response.clone(),
      error: this.error,
      metadata: this.metadata,
      logsEnabled: this.logsEnabled,
    });
  };
}
