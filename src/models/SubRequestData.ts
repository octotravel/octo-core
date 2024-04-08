import { BaseRequestData, IBaseRequestData } from './BaseRequestData';
import { SubMetadata } from './SubMetadata';
import { SubRequestRetryData } from './SubRequestRetryData';

export class SubRequestData extends BaseRequestData implements IBaseRequestData {
  public id: string;
  public request: Request;
  public response: Response;
  public retries: SubRequestRetryData[] = [];
  public error: Error | null = null;
  public metadata: SubMetadata;
  public logsEnabled: boolean;

  public constructor({
    id,
    request,
    response,
    retries,
    error,
    metadata,
    logsEnabled,
  }: {
    id: string;
    request: Request;
    response: Response;
    error: Error | null;
    retries: SubRequestRetryData[];
    metadata: SubMetadata;
    logsEnabled: boolean;
  }) {
    super();
    this.id = id;
    this.response = response;
    this.request = request;
    this.retries = retries;
    this.error = error;
    this.metadata = metadata;
    this.logsEnabled = logsEnabled;
  }

  public getFinalResponse(): Response {
    if (this.retries.length > 0) {
      return this.retries[-1].response;
    }

    return this.response;
  }

  public clone = (): SubRequestData => {
    return new SubRequestData({
      id: this.id,
      request: this.request.clone(),
      response: this.response.clone(),
      retries: this.retries,
      error: this.error,
      metadata: this.metadata,
      logsEnabled: this.logsEnabled,
    });
  };
}
